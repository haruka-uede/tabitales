const PILLARS = [
  {
    name: "Haruki Murakami",
    place: "Tokyo",
    blurb:
      "One of the most internationally recognized Japanese novelists. His Tokyo — jazz bars, quiet cafés, city walks — is a recurring backdrop across his fiction.",
  },
  {
    name: "Osamu Dazai",
    place: "Tsugaru, Aomori",
    blurb:
      "Dazai's memoir Tsugaru retraces his rural hometown in northern Japan, from his family's preserved mansion in Kanagi to the remote coastal village of Kodomari.",
  },
  {
    name: "Keigo Higashino",
    place: "Various regions",
    blurb:
      "A contemporary mystery writer whose novels — several adapted into hit films and shows — are tied to real, specific settings across Japan.",
  },
];

export default function PillarsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">Authors We Follow</h1>
      <p className="text-neutral-600 mb-10">
        Tabi Tales is an independent, unofficial fan project. We are not affiliated
        with or endorsed by any of the authors, publishers, or rights holders
        mentioned below.
      </p>
      <div className="space-y-8">
        {PILLARS.map((pillar) => (
          <div key={pillar.name}>
            <p className="text-sm text-neutral-500">{pillar.place}</p>
            <h2 className="text-xl font-medium">{pillar.name}</h2>
            <p className="text-neutral-600 mt-1">{pillar.blurb}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
