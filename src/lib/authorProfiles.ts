import { slugify } from "./slug";

export type AuthorProfile = {
  // Display-only Japanese name for JA pages. The canonical `authors`
  // frontmatter field (used for slugs and Booking.com lookups) stays
  // romanized/untranslated on purpose - see .claude/commands/translate-article.md
  // and src/lib/slug.ts. Falls back to the romanized name if unset.
  nameJa?: string;
  // Hiragana reading of nameJa, used only for あいうえお (gojuon) sorting.
  // Kanji have no inherent reading, so `nameJa.localeCompare(other, "ja")`
  // sorts by glyph shape, not pronunciation - this field is what makes a
  // real gojuon-ordered sort possible. Falls back to nameJa (or the
  // romanized name) where unset, same incremental pattern as nameJa itself.
  yomiJa?: string;
  blurb?: string;
  // JA equivalent of blurb, not a translation pulled at render time - filled
  // in as needed, same incremental pattern as nameJa. Only shown on JA pages
  // (blurb itself stays EN-only); no fallback, since showing the EN blurb on
  // a JA page reintroduces the exact "written for foreigners" tone problem
  // .claude/commands/translate-article.md's tone pass exists to avoid.
  blurbJa?: string;
};

export const AUTHOR_PROFILES: Record<string, AuthorProfile> = {
  [slugify("Haruki Murakami")]: {
    nameJa: "村上春樹",
    yomiJa: "むらかみはるき",
    blurb:
      "One of the most internationally recognized Japanese novelists. His Tokyo — jazz bars, quiet cafés, city walks — is a recurring backdrop across his fiction.",
    blurbJa:
      "村上春樹は、世界的に最も知られる日本人作家の一人である。ジャズバー、静かな喫茶店、街歩きなど、彼の作品には東京の風景が繰り返し登場する。",
  },
  [slugify("Osamu Dazai")]: {
    nameJa: "太宰治",
    yomiJa: "だざいおさむ",
    blurb:
      "Dazai's memoir Tsugaru retraces his rural hometown in northern Japan, from his family's preserved mansion in Kanagi to the remote coastal village of Kodomari.",
    blurbJa:
      "紀行文『津軽』では、生家のある金木から、幼い頃の太宰を育てた「たけ」と再会した小泊まで、青森県北部の故郷を辿る旅の道のりが描かれている。",
  },
  [slugify("Keigo Higashino")]: {
    blurb:
      "A contemporary mystery writer whose novels — several adapted into hit films and shows — are tied to real, specific settings across Japan.",
  },
  [slugify("Natsume Soseki")]: {
    nameJa: "夏目漱石",
    yomiJa: "なつめそうせき",
    blurb:
      "Widely considered the most important novelist of modern Japan. His novels map onto real places he lived and taught — from a Shikoku bathhouse to a Tokyo cemetery where he's actually buried.",
    blurbJa:
      "夏目漱石は、近代日本文学を代表する作家として広く知られている。彼の小説の舞台には、実際に暮らし教鞭を執った場所が数多く重なる。四国の湯屋から、漱石自身が眠る東京の墓地まで、その広がりはさまざまだ。",
  },
  [slugify("Junichiro Tanizaki")]: {
    nameJa: "谷崎潤一郎",
    yomiJa: "たにざきじゅんいちろう",
    blurb:
      "Tanizaki lived out much of what he wrote in Naomi: in the early 1920s he moved to Yokohama's Westernized Yamate district and took up the same ballroom dancing and fashion he later gave his characters, before the 1923 Great Kanto Earthquake forced him to relocate to the Kansai region.",
    blurbJa:
      "谷崎潤一郎は、『痴人の愛』に描いた暮らしの多くを、自らも実践していた作家である。1920年代初頭、横浜の洋風地区・山手に移り住み、後に作中人物に与えたのと同じ社交ダンスや洋装を自ら楽しんだ。1923年の関東大震災をきっかけに、関西地方へ移り住むことになる。",
  },
  [slugify("Tatsuhiro Oshiro")]: {
    nameJa: "大城立裕",
    yomiJa: "おおしろたつひろ",
    blurb:
      "Oshiro grew up in central Okinawa under the decades of U.S. military administration that followed the war, and became the first Okinawan-born author to win the Akutagawa Prize, for Cocktail Party in 1967.",
    blurbJa:
      "大城立裕は、戦後の沖縄で27年間続いた米軍統治のもとで育った。1967年、『カクテル・パーティー』で沖縄出身作家として初めて芥川賞を受賞している。",
  },
  [slugify("Masuji Ibuse")]: {
    nameJa: "井伏鱒二",
    yomiJa: "いぶせますじ",
    blurb:
      "Ibuse wrote about ordinary lives with a dry, understated humor across a long career, most famously in Black Rain (1966) — built from a real atomic-bomb survivor's diary rather than an invented account.",
    blurbJa:
      "井伏鱒二は、生涯を通じて市井の人々の暮らしを、抑えた筆致とユーモアで描き続けた作家である。代表作『黒い雨』(1966年)は、実在する被爆者の日記をもとに書かれている。",
  },
  [slugify("Ryunosuke Akutagawa")]: {
    nameJa: "芥川龍之介",
    yomiJa: "あくたがわりゅうのすけ",
    blurb:
      "Often called the father of the Japanese short story, and the namesake of the Akutagawa Prize, Japan's top literary award for new writers. Spinning Gears, one of his last works, was finished weeks before his 1927 suicide, and reads as a near-direct record of the paranoia that consumed him.",
    blurbJa:
      "「日本近代文学の父」とも称され、新人作家に贈られる日本最高峰の文学賞、芥川賞にその名を残す。晩年の作品『歯車』は、1927年に自殺する数週間前に書き上げられたもので、当時彼を蝕んでいた妄想をほぼそのまま記録したような作品である。",
  },
  [slugify("Murasaki Shikibu")]: {
    nameJa: "紫式部",
    yomiJa: "むらさきしきぶ",
    blurb:
      "A lady-in-waiting at the Heian-era imperial court around the year 1000, and the author of The Tale of Genji — widely considered the world's first novel. Little is known of her real life beyond her own diary and the court records of the time; even \"Murasaki Shikibu\" is a later nickname, not her birth name, which was never recorded.",
    blurbJa:
      "紫式部は、西暦1000年前後の平安朝廷に仕えた女房であり、世界最古の小説とされる『源氏物語』の作者である。実生活について分かっていることは、自身の日記や当時の宮廷記録から知られる範囲にとどまる。「紫式部」という呼び名自体も後世につけられたもので、本名は記録に残っていない。",
  },
  [slugify("Kenji Miyazawa")]: {
    nameJa: "宮沢賢治",
    yomiJa: "みやざわけんじ",
    blurb:
      "A poet, children's-story writer, agricultural teacher, and devout Buddhist who spent nearly all of his short life in rural Iwate. Night on the Galactic Railroad, his best-known work, was still unfinished when he died of illness in 1933 at 37; it was assembled from his notebooks and published the following year.",
    blurbJa:
      "宮沢賢治は、詩人・童話作家・農学校教師であり、熱心な法華信者でもあった。その短い生涯のほとんどを、故郷である岩手の農村で過ごしている。代表作『銀河鉄道の夜』は、1933年に37歳で病没した時点でも未完のままであり、残された手帳やノートをもとに翌年出版された。",
  },
  [slugify("Yasunari Kawabata")]: {
    nameJa: "川端康成",
    yomiJa: "かわばたやすなり",
    blurb:
      "In 1968, Kawabata became the first Japanese writer to win the Nobel Prize in Literature, cited in part for Snow Country. He was a repeat visitor to the hot-spring town of Yuzawa starting in 1934, and wrote parts of the novel in a room at the inn where he stayed.",
    blurbJa:
      "川端康成は1968年、日本人として初めてノーベル文学賞を受賞した作家であり、『雪国』はその受賞理由の一つに挙げられている。1934年から温泉町・湯沢を繰り返し訪れ、定宿としていた旅館の一室で作品の一部を執筆した。",
  },
  [slugify("Yukio Mishima")]: {
    nameJa: "三島由紀夫",
    yomiJa: "みしまゆきお",
    blurb:
      "One of postwar Japan's most internationally read novelists, and a lifelong obsessive about beauty and destruction. The Temple of the Golden Pavilion turns the real 1950 arson of Kyoto's Kinkaku-ji into a novel about a mind consumed by the thing it loves.",
    blurbJa:
      "三島由紀夫は、戦後日本を代表する国際的な知名度を持つ作家であり、美と破壊への強い執着を生涯持ち続けた。『金閣寺』は、1950年に実際に起きた京都・金閣寺放火事件を題材に、美に取り憑かれていく人間の内面を描いた作品である。",
  },
};

export function getAuthorNameJa(slug: string, fallback: string): string {
  return AUTHOR_PROFILES[slug]?.nameJa ?? fallback;
}

export function getAuthorSortKeyJa(slug: string, fallback: string): string {
  const profile = AUTHOR_PROFILES[slug];
  return profile?.yomiJa ?? profile?.nameJa ?? fallback;
}
