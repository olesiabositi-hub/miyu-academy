const assets = {
  hero: { name: '01-HERO-gaia-birth-of-order', width: 1672, height: 941, en: 'Gaia emerging as living Earth in the first light of the primordial world.', ru: 'Гея — живая Земля в первом свете первозданного мира.' },
  middle: { name: '02-MIDDLE-gaia-primordial-world', width: 1672, height: 941, en: 'Gaia and the vast primordial landscape before the Olympian order.', ru: 'Гея и первозданный мир до установления олимпийского порядка.' },
  chaos: { name: '03-DETAIL-chaos-titans', width: 1254, height: 1254, en: 'Dark primordial waters and ancient divine forms.', ru: 'Тёмные первозданные воды и древние божественные формы.' },
  gaia: { name: '04-DETAIL-gaia', width: 1254, height: 1254, en: 'Gaia embodied in mountains, vegetation and waterfalls.', ru: 'Гея, воплощённая в горах, растениях и водопадах.' },
  titans: { name: '05-DETAIL-titans', width: 1254, height: 1254, en: 'The ancient generation of Titans within a celestial mountain landscape.', ru: 'Древнее поколение титанов в небесном горном пейзаже.' },
};
export function ModuleOneArt({kind, locale}:{kind:keyof typeof assets;locale:'ru'|'en'}) {
  const a=assets[kind]; const small=a.width===1672?836:628; const base=`/visuals/module-01/${a.name}`;
  return <figure className={`m1Art m1Art-${kind}`}><img src={`${base}-${a.width}.webp`} srcSet={`${base}-${small}.webp ${small}w, ${base}-${a.width}.webp ${a.width}w`} sizes={a.width===1672?'(max-width: 900px) calc(100vw - 40px), 836px':'(max-width: 600px) calc(100vw - 40px), 360px'} width={a.width} height={a.height} alt={a[locale]} loading={kind==='hero'?'eager':'lazy'} fetchPriority={kind==='hero'?'high':'auto'} /></figure>;
}
