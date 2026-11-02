import { watchEffect, type MaybeRefOrGetter, toValue } from 'vue';
import { site } from '@/lib/site';

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.append(el);
  }
  el.content = value;
}

/** Title and description for client-side navigation; the backend fills the same tags on first load (docs/adr/0001). */
export function usePageMeta(
  title: MaybeRefOrGetter<string | undefined>,
  description?: MaybeRefOrGetter<string | undefined>,
) {
  watchEffect(() => {
    const t = toValue(title);
    const full = t
      ? `${t} | ${site.name}`
      : `${site.name} | آسمانِ لحظهٔ تولدت را بخوان`;
    document.title = full;
    setMeta('property', 'og:title', full);
    const d = toValue(description);
    if (d) {
      setMeta('name', 'description', d);
      setMeta('property', 'og:description', d);
    }
  });
}
