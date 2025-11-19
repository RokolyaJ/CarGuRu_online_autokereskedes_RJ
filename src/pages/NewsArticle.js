import React from "react";
import { useParams } from "react-router-dom";

export default function NewsArticle() {
  const { slug } = useParams();

  const articles = {
    "audi-skoda-elektromos-2026": {
      title: "Audi és Skoda: új elektromos modellek 2026-ra",
      date: "2025/09/25",
      heroImage: "/images/home_page/news/audi_and_skoda.jpg",
      extraImages: [
        "/images/home_page/news/audi_factory.jpg",
        "/images/home_page/news/skoda_concept.jpg",
        "/images/home_page/news/electric_platform.jpg"
      ],
      paragraphs: [
        "Az Audi és a Skoda közösen jelentette be legújabb, teljesen elektromos SUV modelljeit, amelyek az új MEB+ platformra épülnek. Ez a platform mérföldkő az elektromobilitásban, hiszen kisebb energiafelhasználás mellett nagyobb teljesítményt kínál.",
        "Az új akkumulátor-technológia nagyobb energiasűrűséget biztosít, így az autók egyetlen töltéssel akár 700 kilométert is megtehetnek. A hőmenedzsment rendszer intelligensen szabályozza a cellák hőmérsékletét, így szélsőséges időjárási körülmények között is stabil teljesítmény érhető el.",
        "A gyártás 2026-ban indul Európa több üzemében, köztük Magyarországon. A győri gyár a hajtásláncok és vezérlőelektronika összeszerelésében kap kulcsszerepet, ezzel több száz új, magas képzettséget igénylő munkahelyet teremtve.",
        "Mindkét márka célja, hogy 2030-ra az új modellek legalább 80%-a tisztán elektromos vagy plug-in hibrid legyen. Ezzel párhuzamosan növelik a megújuló energiaforrások arányát a teljes gyártási folyamatban.",
        "A platform egyik legnagyobb előnye az alacsonyabb súlypont, amely javítja a menetstabilitást és csökkenti az energiafogyasztást. Ez a megoldás hosszabb távú utazások során is kényelmesebb és biztonságosabb élményt kínál.",
        "Az utastér anyaghasználata forradalmi: a kárpitok és műszerfalak 70%-ban újrahasznosított forrásból származnak. Ezzel a lépéssel az Audi és a Skoda is erős üzenetet küld a körforgásos gazdaság mellett.",
        "A teljesen megújított infotainment rendszer 5G-alapú, így valós idejű frissítések, streaming és távdiagnosztika egyaránt megvalósul. A mesterséges intelligencia támogatja a vezetőt az útvonaltervezésben és az energiamenedzsmentben.",
        "Az új modellek a 3-as szintű önvezetés képességével érkeznek, ami lehetővé teszi az autópályán hosszú távú, emberi beavatkozás nélküli vezetést. A fejlett szenzorok és a mélytanuló algoritmusok folyamatosan alkalmazkodnak a forgalom változásaihoz.",
        "A gyártás energiaellátását teljes egészében megújuló források – napelemek és helyi szélerőművek – biztosítják, így a folyamat már 2026-tól karbonsemleges lehet.",
        "Piaci elemzők szerint az új Audi és Skoda SUV-k jelentősen bővítik a márkák globális piaci részesedését. Az előrejelzések 2030-ig 15%-os növekedést prognosztizálnak az elektromos SUV-szegmensben."
      ]
    },

    "mercedes-bmw-onvezetes": {
      title: "Mercedes és BMW: közös fejlesztés az önvezetésért",
      date: "2025/09/22",
      heroImage: "/images/home_page/news/mercedesz_and_bmw.jpg",
      extraImages: [
        "/images/home_page/news/mercedes_lab.jpg",
        "/images/home_page/news/bmw_testtrack.jpg"
      ],
      paragraphs: [
        "A Mercedes-Benz és a BMW bejelentette, hogy stratégiai partnerség keretében együttműködnek a 4-es szintű önvezető rendszerek fejlesztésében, amelyek 2027-re kereskedelmi forgalomban is elérhetők lesznek Európában.",
        "A közös program célja, hogy egységesítsék a mesterséges intelligencián alapuló szenzor- és szoftvermegoldásokat, ezzel csökkentve a költségeket és felgyorsítva a fejlesztési ciklusokat.",
        "Mindkét márka dedikált tesztpályákat létesít Németországban és az Egyesült Államokban, ahol valós forgalmi helyzeteket modellezve több millió kilométernyi adatot gyűjtenek az algoritmusok tökéletesítéséhez.",
        "A projekt egyik alappillére az új generációs LIDAR és radar rendszerek bevezetése. Ezek képesek 300 méteres távolságból is milliméteres pontosságú 3D-térképet készíteni, ami alapvető a biztonságos önvezetéshez.",
        "A mesterséges intelligencia nemcsak az akadályok felismerésére szolgál, hanem tanul az emberi vezetési mintákból is, így a járművek képesek előre jelezni más közlekedők viselkedését."
      ]
    },

    "volkswagen-zoldebb-jovo": {
      title: "Volkswagen-csoport: erős második negyedév, zöldebb jövő",
      date: "2025/09/18",
      heroImage: "/images/home_page/news/Volkswagen_results.jpg",
      extraImages: [
        "/images/home_page/news/vw_battery.jpg",
        "/images/home_page/news/vw_evline.jpg"
      ],
      paragraphs: [
        "A Volkswagen-csoport a 2025-ös év második negyedévében 15%-os növekedést könyvelt el az elektromos és plug-in hibrid autók eladásában, ezzel megerősítve vezető szerepét a fenntartható mobilitás piacán.",
        "A cégcsoport jelentős beruházásokat hajtott végre az akkumulátor-összeszerelés területén is. A győri üzem bővítése új munkahelyeket teremt, és 2026-tól évi 500 ezer akkumulátor-modul gyártását teszi lehetővé.",
        "A vezetőség kiemelte: a 2030-as évek közepére a teljes járműpaletta több mint 80%-a tisztán elektromos vagy hibrid meghajtású lesz. Emellett cél, hogy az ellátási láncban 2040-re elérjék a teljes karbonsemlegességet.",
        "Pénzügyi oldalon a konszern 324,7 milliárd eurós árbevételt, 19,1 milliárd eurós működési nyereséget és 36,1 milliárd eurós likviditást jelentett. Ez a stabilitás lehetővé teszi a folyamatos kutatás-fejlesztést.",
        "A VW stratégiai megállapodásokat kötött több európai megújuló energia-szolgáltatóval, hogy gyárai 100%-ban zöld energiával működjenek. Ezzel csökkentik a CO₂-kibocsátást és hozzájárulnak a kontinens klímacéljaihoz.",
        "A konszern új akkumulátor-újrahasznosító központokat is épít, ahol a használt cellákat ipari energiatárolókban hasznosítják újra. Ez a lépés hosszú távon minimalizálja a ritkaföldfémek iránti igényt.",
        "A vállalat hangsúlyt fektet a szoftverfejlesztésre: az új ID.3 és ID.4 modellek képesek vezeték nélküli frissítéseket kapni, és mesterséges intelligencia alapú asszisztenst kínálnak.",
        "A prémium márkák – Audi, Porsche, Bentley – továbbra is erős húzóerőt jelentenek. Az elektromos Taycan és az új e-tron GT rekordeladásokat produkált a negyedévben.",
        "A Volkswagen célja, hogy 2035-re a teljes termelésben és beszállítói hálózatban nullára csökkentse a nettó CO₂-kibocsátást, ami példát mutathat az egész iparág számára."
      ]
    }
  };

  const article = articles[slug];
  if (!article) return <p style={{ padding: 40 }}>A keresett cikk nem található.</p>;

  const styles = {
    wrapper: {
      maxWidth: "900px",
      margin: "120px auto 40px",
      padding: "0 20px",
      lineHeight: "1.6",
      fontSize: "18px"
    },
    heroImage: {
      width: "100%",
      maxWidth: "800px",
      display: "block",
      margin: "30px auto",
      borderRadius: "12px"
    },
    extraImage: {
      width: "100%",
      maxWidth: "700px",
      display: "block",
      margin: "25px auto",
      borderRadius: "12px"
    },
    title: { fontSize: "2.6rem", fontWeight: "bold", marginBottom: "20px", textAlign: "center" },
    date: { fontSize: "1rem", color: "#aaa", textAlign: "center", marginBottom: "20px" },
    paragraph: { marginBottom: "16px", textAlign: "justify" }
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>{article.title}</h1>
      <p style={styles.date}>{article.date}</p>
      <img src={article.heroImage} alt={article.title} style={styles.heroImage} />
      {article.paragraphs.map((p, idx) => (
        <p key={idx} style={styles.paragraph}>{p}</p>
      ))}
      {article.extraImages && article.extraImages.map((img, i) => (
        <img key={i} src={img} alt={`extra-${i}`} style={styles.extraImage} />
      ))}
    </div>
  );
}
