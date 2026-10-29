import type { Piece } from "./site-data";
import { CATALOG_ADDITIONS, CATALOG_NEW_PHOTOS } from "./catalog-additions";
import { applyProductUpdates } from "./catalog-variants";

const photo = (name: string) => `/images/catalog/${name}.webp`;

// Curated from the 40-piece product list supplied with the product photography.
// Products without a matching photograph remain drafts until an image is provided.
const ORIGINAL_CATALOG: Piece[] = [
  {
    id: "piece-01", name: "Piña vidriada con flores", nameEn: "Glazed Pineapple with Flowers",
    cat: "cer", designer: "Artesanos de San José de Gracia", origin: "Michoacán, México",
    mat: ["Cerámica modelada y vidriada", "Handcrafted glazed ceramic"], dim: "42 × 23 in",
    description: [
      "Una piña de cerámica hecha a mano y adornada con flores esculpidas en tonos marfil y azul. Cada flor aporta textura y carácter; en la cultura mexicana, la piña simboliza hospitalidad, calidez y abundancia.",
      "A handcrafted ceramic pineapple adorned with sculpted flowers in warm ivory and blue. Each bloom adds texture and character; in Mexican culture, the pineapple symbolizes hospitality, warmth, and abundance.",
    ],
    images: [photo("piece-01-01"), photo("piece-01-02"), photo("piece-01-03"), photo("piece-01-04")],
  },
  {
    id: "piece-02", name: "Piña vidriada azul", nameEn: "Blue Glazed Pineapple",
    cat: "cer", designer: "Artesanos de Michoacán", origin: "Michoacán, México",
    mat: ["Cerámica hecha a mano con acabado vidriado", "Handmade glazed ceramic"], dim: "15 × 12 in",
    description: [
      "Una pieza de bienvenida de intenso azul cobalto, con una superficie de textura minuciosa y brillo casi joya. Aporta profundidad y carácter a una consola, repisa o mesa de acento.",
      "A striking expression of welcome in rich cobalt blue, with intricate, jewel-like texture. It brings depth and character to a console, shelf, or accent table.",
    ],
    images: [photo("piece-02-01"), photo("piece-02-02"), photo("piece-02-03")],
  },
  {
    id: "piece-03", name: "Piña vidriada roja", nameEn: "Red Glazed Pineapple",
    cat: "cer", designer: "Artesanos de Michoacán", origin: "Michoacán, México",
    mat: ["Cerámica hecha a mano con acabado vidriado", "Handmade glazed ceramic"], dim: "15 × 8 in",
    description: [
      "Una piña escultórica en tono carmesí, con cuerpo de relieve pronunciado y hojas modeladas. Hecha a mano por artesanos de Michoacán; cada ejemplar es una pieza singular.",
      "A sculptural pineapple in rich crimson, with a beautifully textured body and modeled leaves. Handmade by artisans in Michoacán, each example is a one-of-a-kind accent.",
    ],
    images: [photo("piece-03-01"), photo("piece-03-02")],
  },
  {
    id: "piece-04", name: "Árbol de la vida", nameEn: "Tree of Life",
    cat: "cer", designer: "Artesanos de Metepec", origin: "Metepec, Estado de México",
    mat: ["Barro esculpido y pintado a mano", "Hand-sculpted and painted clay"], dim: "21 × 19 in",
    description: [
      "Árbol de la vida de barro, modelado y pintado a mano. Esta tradición alfarera de Metepec representa a Adán y Eva y la creación de la vida.",
      "A hand-sculpted and painted clay Tree of Life from Metepec. This iconic Mexican pottery tradition depicts Adam and Eve and the creation of life.",
    ],
    images: [photo("piece-04-01"), photo("piece-04-02")],
  },
  {
    id: "piece-05", name: "Piña vidriada beige", nameEn: "Beige Glazed Pineapple",
    cat: "cer", designer: "Artesanos de Michoacán", origin: "Michoacán, México",
    mat: ["Cerámica vidriada y pintada a mano", "Hand-painted glazed ceramic"], dim: "24 × 12 in",
    description: [
      "Piña de cerámica hecha y pintada a mano, con tonos marfil y un acabado terracota suavemente envejecido. Una pieza curada de Michoacán con una presencia cálida y serena.",
      "A handmade and painted ceramic pineapple in ivory with a softly weathered terracotta finish. A curated piece from Michoacán with a warm, quiet presence.",
    ],
    images: [photo("piece-05-01"), photo("piece-05-02")],
  },
  {
    id: "piece-06", name: "Jarrón de Pambatán", nameEn: "Pambatán Vase",
    cat: "cer", designer: "Alfareros purépechas", origin: "Pambatán, Michoacán",
    mat: ["Barro esculpido y pintado a mano", "Hand-sculpted and painted clay"], dim: "12 × 8 in",
    description: [
      "Vasija de alfarería tradicional, pintada y esculpida a mano por alfareros purépechas de Pambatán. El relieve y el patrón geométrico resaltan el trabajo artesanal de la pieza.",
      "Traditional Mexican pottery, hand-painted and sculpted by Purépecha artisans in Pambatán. Its raised details and geometric pattern highlight the handwork behind the piece.",
    ],
    images: [photo("piece-06-01"), photo("piece-06-02")],
  },
  {
    id: "piece-07", name: "Caja recuerdo de Pambatán", nameEn: "Pambatán Keepsake Box",
    cat: "cer", designer: "Alfareros purépechas", origin: "Pambatán, Michoacán",
    mat: ["Barro pintado y esculpido a mano", "Hand-painted and sculpted clay"], dim: "No especificadas",
    description: [
      "Caja de barro en tonos terracota, con patrones marfil, flores en relieve y una flor en la tapa a modo de remate. Pintada y esculpida a mano por alfareros purépechas de Pambatán.",
      "A warm terracotta keepsake box with ivory patterns, raised florals, and a blooming flower finial. Hand-painted and sculpted by Purépecha artisans in Pambatán.",
    ],
    images: [photo("piece-07-01"), photo("piece-07-02")],
  },
  {
    id: "piece-08", name: "Corazón sagrado con milagros", nameEn: "Sacred Heart Milagros",
    cat: "pop", designer: "Artesanos mexicanos", origin: "México",
    mat: ["Pieza tallada y pintada; milagros de metal", "Carved and painted piece with metal milagros"], dim: "No especificadas",
    description: [
      "Corazón sagrado tallado y pintado a mano, adornado con pequeños milagros de metal estampado. El motivo representa amor divino, pasión y sanación; los dijes suelen tomar formas de animales, objetos o partes del cuerpo.",
      "A hand-carved and painted Sacred Heart adorned with tiny stamped-metal milagros. The motif represents divine love, passion, and healing; the charms often take the shape of animals, objects, or body parts.",
    ],
    images: [photo("piece-08-01"), photo("piece-08-02"), photo("piece-08-03")],
  },
  {
    id: "piece-09", name: "Figuras Wixárika", nameEn: "Wixárika Figures",
    cat: "pop", designer: "Artistas Wixárika", origin: "Jalisco, México",
    mat: ["Talla y pintura a mano", "Hand-carved and painted"], dim: "No especificadas",
    description: [
      "Figuras de animales talladas y pintadas a mano por artistas Wixárika de Jalisco. Sus formas y patrones ofrecen una mirada a una tradición artística de gran riqueza; cada pieza es única.",
      "Animal figures hand-carved and painted by Wixárika artists in Jalisco. Their forms and patterns offer a glimpse into a rich artistic heritage; each piece is unique.",
    ],
    images: [photo("piece-09-01"), photo("piece-09-02"), photo("piece-09-03"), photo("piece-09-04"), photo("piece-09-05")],
  },
  {
    id: "piece-10", name: "Figuras Wixárika en peltre", nameEn: "Wixárika Figures in Pewter",
    cat: "pop", designer: "Artistas Wixárika", origin: "Jalisco, México",
    mat: ["Peltre con decoración Wixárika", "Pewter with Wixárika decoration"], dim: "No especificadas",
    description: [
      "La vibrante iconografía Wixárika se encuentra con el acabado luminoso del peltre. Patrones y detalles minuciosos aportan color, carácter y expresión cultural a cada pieza, hecha a mano en Jalisco.",
      "Vibrant Wixárika artistry meets the luminous finish of pewter. Intricate patterns bring color, character, and cultural expression to each distinctive piece, handmade in Jalisco.",
    ],
    images: [photo("piece-10-01"), photo("piece-10-02"), photo("piece-10-03"), photo("piece-10-04"), photo("piece-10-05"), photo("piece-10-06"), photo("piece-10-07"), photo("piece-10-08"), photo("piece-10-09")],
  },
  {
    id: "piece-11", name: "Piezas Wixárika con chaquira", nameEn: "Wixárika Chaquira Beadwork",
    cat: "pop", designer: "Artistas Wixárika", origin: "México",
    mat: ["Chaquira aplicada a mano", "Hand-applied chaquira beads"], dim: "No especificadas",
    description: [
      "Piezas cubiertas con numerosas chaquiras de colores dispuestas en patrones intrincados. La textura y el color celebran la destreza artesanal Wixárika y llevan una expresión distintiva del arte mexicano al hogar.",
      "Pieces covered with countless colorful chaquira beads arranged in intricate patterns. Texture and color celebrate Wixárika craftsmanship and bring a distinctive expression of Mexican art into the home.",
    ], images: [], published: false,
  },
  {
    id: "piece-12", name: "Rosetones tallados", nameEn: "Carved Rosettes",
    cat: "esc", designer: "Artesanos mexicanos", origin: "México",
    mat: ["Madera tallada a mano", "Hand-carved wood"], dim: "No especificadas",
    description: [
      "Conjunto de rosetones de madera tallada a mano. Los relieves circulares y el acabado cálido reúnen el carácter rústico y la precisión de la talla artesanal mexicana.",
      "A collection of hand-carved wooden rosettes. Circular reliefs and a warm finish bring together rustic character and the precision of Mexican artisan carving.",
    ],
    images: [photo("piece-12-01"), photo("piece-12-02"), photo("piece-12-03"), photo("piece-12-04")],
  },
  {
    id: "piece-13", name: "Caballo blanco bajo domo", nameEn: "White Horse under Glass Dome",
    cat: "esc", designer: "Artesanos mexicanos", origin: "México",
    mat: ["Caballo de cerámica y vidrio soplado", "Ceramic horse and hand-blown glass"], dim: "No especificadas",
    description: [
      "Un caballo blanco de cerámica se presenta bajo un domo de vidrio soplado a mano. La combinación de vidrio, forma escultórica y base decorativa reúne distintas técnicas de la artesanía mexicana.",
      "A white ceramic horse presented beneath a hand-blown glass dome. The combination of glass, sculptural form, and decorative base brings together several Mexican craft techniques.",
    ],
    images: [photo("piece-13-01"), photo("piece-13-02")],
  },
  {
    id: "piece-14", name: "Domo extra grande con pájaros", nameEn: "Extra-Large Dome with Birds",
    cat: "esc", designer: "Artesanos", origin: "No especificado",
    mat: ["Madera oscura, pájaros de bronce, soportes de metal y vidrio soplado", "Dark-finished wood, bronze birds, metal stands, and hand-blown glass"], dim: "Ø 38 × 59 cm",
    description: [
      "Domo de vidrio soplado sobre una base de madera oscura. En el interior, pájaros de bronce sobre soportes metálicos componen una escena escultórica que destaca los pequeños detalles.",
      "A hand-blown glass dome sits on a dark-finished wooden base. Bronze birds on metal stands create a sculptural scene that celebrates the smallest details.",
    ],
    images: [photo("piece-14-01"), photo("piece-14-02")],
  },
  {
    id: "piece-15", name: "Caballo dorado bajo domo", nameEn: "Gold Horse under Glass Dome",
    cat: "esc", designer: "Artesanos", origin: "No especificado",
    mat: ["Caballo de resina y vidrio soplado", "Resin horse and hand-blown glass"], dim: "Domo extra grande; medidas no especificadas",
    description: [
      "Figura de caballo dorado en resina, montada sobre pedestales y resguardada bajo un domo extra grande de vidrio soplado a mano. Color y transparencia dan forma a una composición decorativa de presencia marcada.",
      "A gold resin horse displayed on pedestals beneath an extra-large hand-blown glass dome. Color and transparency shape a decorative composition with a striking presence.",
    ],
    images: [photo("piece-15-01"), photo("piece-15-02")],
  },
  {
    id: "piece-16", name: "Caballete de madera", nameEn: "Wooden Easel",
    cat: "esc", designer: "Artesanos", origin: "No especificado",
    mat: ["Madera maciza y metal; acabado blanco y gris envejecido", "Solid wood and metal; distressed white and gray finish"], dim: "22 × 55 × 40 cm",
    description: [
      "Caballete ajustable hecho a mano en madera maciza y metal, con acabado blanco y gris de apariencia envejecida. Su diseño práctico permite exhibir obras enmarcadas y aporta carácter al espacio.",
      "An adjustable easel handmade from solid wood and metal, finished in distressed white and gray. Its practical design displays framed artwork while adding character to a space.",
    ],
    images: [photo("piece-16-01"), photo("piece-16-02")],
  },
  {
    id: "piece-17", name: "Corona de resina blanca", nameEn: "White Resin Crown",
    cat: "esc", designer: "Colección Crown", origin: "No especificado",
    mat: ["Resina moldeada con acabado pintado envejecido", "Mold-cast resin with distressed painted finish"],
    dim: "Mini: Ø 21 × 25 cm; chica: Ø 27 × 29 cm; mediana: Ø 33 × 36 cm; grande: Ø 41 × 50 cm; extra grande: Ø 47 × 55 cm",
    description: [
      "Corona decorativa de resina moldeada, terminada con una ligera capa de pintura para lograr un aspecto envejecido. Está disponible en cinco tamaños y en acabados blanco o gris.",
      "A decorative resin crown, finished with a light coat of paint for a distressed look. It is available in five sizes and in white or gray finishes.",
    ],
    images: [photo("piece-17-01"), photo("piece-17-02")],
  },
  {
    id: "piece-18", name: "Colección Superhéroes", nameEn: "Superheroes Collection",
    cat: "arte", designer: "Carlos Gunther Maier para House Armida", origin: "No especificado",
    mat: ["Impresión fotográfica enmarcada en vidrio", "Photographic print framed in glass"], dim: "43.18 × 55.88 cm o 101.6 × 152.4 cm",
    description: [
      "Colección exclusiva de impresiones digitales para House Armida, creada por Carlos Gunther Maier. Cada imagen se imprime en papel fotográfico y se presenta enmarcada detrás de vidrio.",
      "An exclusive digital print collection for House Armida by Carlos Gunther Maier. Each image is printed on photographic paper and framed behind glass.",
    ], images: [], published: false,
  },
  {
    id: "piece-19", name: "Lámpara de mesa Mano", nameEn: "Hand Table Lamp",
    cat: "esc", designer: "Artesanos", origin: "No especificado",
    mat: ["Aluminio fundido en molde", "Mold-cast aluminum"], dim: "20 × 13 × 15 cm",
    description: [
      "Lámpara escultórica de mesa con una mano de aluminio fundido que sostiene la fuente de luz. Un detalle singular que convierte un objeto funcional en un acento decorativo.",
      "A sculptural table lamp with a cast-aluminum hand supporting the light source. A distinctive detail turns a functional object into a decorative accent.",
    ], images: [photo("piece-19-01")],
  },
  {
    id: "piece-20", name: "Lámpara de mesa bajo domo", nameEn: "Table Lamp under Glass Dome",
    cat: "esc", designer: "Artesanos mexicanos", origin: "México",
    mat: ["Vidrio soplado a mano, base de madera y foco LED de 4 W", "Hand-blown glass, wooden base, and 4 W LED bulb"],
    dim: "Mini: 14 × 24 cm; chica: 17 × 30 cm; mediana: 17 × 35 cm; grande: 23 × 35 cm; extra grande: 27 × 40 cm",
    description: [
      "Lámpara elaborada por artesanos mexicanos. Cada tamaño combina una pantalla de vidrio soplado a mano, una base de madera tallada y un foco LED de 4 W para crear una luz cálida y acogedora.",
      "Handcrafted by Mexican artisans, each size pairs a hand-blown glass shade with a carved wooden base and a 4 W LED bulb for a warm, inviting light.",
    ], images: [photo("piece-20-01"), photo("piece-20-02")],
  },
  {
    id: "piece-21", name: "Palo de golf Wixárika con base", nameEn: "Wixárika Beaded Golf Club with Base",
    cat: "pop", designer: "Artistas Wixárika", origin: "México",
    mat: ["Palo de golf decorado con chaquira; base de exhibición", "Chaquira-adorned golf club with display base"], dim: "No especificadas",
    description: [
      "Palo de golf intervenido a mano con chaquira en colores y patrones vibrantes. Cada detalle refleja la paciencia y habilidad del artesano; la base permite exhibir esta pieza singular de arte popular mexicano.",
      "A golf club adorned by hand with chaquira in vivid colors and patterns. Each detail reflects the artisan's patience and skill; the base displays this one-of-a-kind piece of Mexican folk art.",
    ], images: [photo("piece-21-01"), photo("piece-21-02")],
  },
  {
    id: "piece-22", name: "Jarrón floral azul cobalto", nameEn: "Cobalt Blue Floral Vase",
    cat: "cer", designer: "Gaya Ceramic", origin: "Indonesia",
    mat: ["Cerámica hecha a mano", "Handmade ceramic"], dim: "No especificadas",
    description: [
      "Jarrón de cerámica hecho a mano por Gaya Ceramic en Indonesia. Su silueta y decoración floral evocan los recipientes japoneses para sake, con un intenso acabado azul cobalto.",
      "A handmade ceramic vase by Gaya Ceramic in Indonesia. Its silhouette and floral decoration are inspired by Japanese sake vessels, finished in a rich cobalt blue.",
    ], images: [], published: false,
  },
  {
    id: "piece-23", name: "Tocado Gelungan", nameEn: "Gelungan Headdress",
    cat: "pop", designer: "Artesanos balineses", origin: "Bali, Indonesia",
    mat: ["Metal con acabado dorado y ornamentación", "Gold-finished metal with ornamental details"], dim: "No especificadas",
    description: [
      "Tocado dorado de elaboración artesanal. En la cultura balinesa, el Gelungan es una corona elaborada y sagrada, vinculada a ceremonias y expresiones tradicionales.",
      "An elaborate handmade golden headdress. In Balinese culture, the Gelungan is a sacred crown associated with ceremonies and traditional expression.",
    ], images: [photo("piece-23-01"), photo("piece-23-02")],
  },
  {
    id: "piece-24", name: "Caballo balinés colgante", nameEn: "Balinese Hanging Horse",
    cat: "esc", designer: "Artesanos locales", origin: "Bali, Indonesia",
    mat: ["Bronce fundido y acabado a mano", "Hand-poured and finished bronze"], dim: "No especificadas",
    description: [
      "Caballo de bronce elaborado mediante fundición y terminado a mano por artesanos locales de Bali. La silueta calada y el soporte suspendido le dan una presencia escultórica.",
      "A bronze horse hand-poured and finished by local artisans in Bali. Its openwork silhouette and suspended stand give it a sculptural presence.",
    ], images: [photo("piece-24-01"), photo("piece-24-02"), photo("piece-24-03"), photo("piece-24-04"), photo("piece-24-05"), photo("piece-24-06"), photo("piece-24-07")],
  },
  {
    id: "piece-25", name: "Buda", nameEn: "Buddha",
    cat: "esc", designer: "Artesanos balineses", origin: "Bali, Indonesia",
    mat: ["Tallado y pintado a mano", "Hand-carved and painted"], dim: "No especificadas",
    description: [
      "Figura de Buda tallada y pintada a mano por artesanos balineses. Su postura serena invita a la calma y evoca paz, atención plena y reflexión interior.",
      "A Buddha figure hand-carved and painted by Balinese artisans. Its serene posture invites calm and evokes peace, mindfulness, and inner reflection.",
    ], images: [photo("piece-25-01"), photo("piece-25-02"), photo("piece-25-03"), photo("piece-25-04")],
  },
  {
    id: "piece-26", name: "Balón de fútbol Wixárika con base", nameEn: "Wixárika Beaded Football with Base",
    cat: "pop", designer: "Artistas Wixárika", origin: "México",
    mat: ["Balón decorado con chaquira; base de exhibición", "Chaquira-adorned football with display base"], dim: "Hecho sobre pedido",
    description: [
      "Balón cubierto a mano con chaquira en patrones y colores vibrantes. La intervención transforma un objeto cotidiano en una pieza decorativa para exhibir. Elaborado sobre pedido.",
      "A football covered by hand with chaquira in vivid patterns and colors. The beadwork turns a familiar object into a decorative display piece. Made to order.",
    ], images: [photo("piece-26-01"), photo("piece-26-02"), photo("piece-26-03"), photo("piece-26-04")],
  },
  {
    id: "piece-27", name: "Oso de goma", nameEn: "Gummy Bear",
    cat: "esc", designer: "No especificado", origin: "No especificado",
    mat: ["Resina translúcida con acabado brillante", "Translucent resin with a glossy finish"], dim: "24 cm de alto",
    description: [
      "Un ícono lúdico reinterpretado como acento escultórico de resina translúcida y acabado brillante. Disponible en azul cobalto, verde, amarillo, rosa, rojo, blanco, negro, azul claro y naranja.",
      "A playful icon reimagined as a glossy, translucent resin accent. Available in cobalt blue, green, yellow, pink, red, white, black, baby blue, and orange.",
    ], images: [photo("piece-27-01")],
  },
  {
    id: "piece-28", name: "Salvavidas", nameEn: "Life Saver",
    cat: "esc", designer: "No especificado", origin: "No especificado",
    mat: ["Resina cristal translúcida", "Translucent crystal resin"], dim: "Ø 13 × 4 cm de alto",
    description: [
      "Homenaje lúdico a un dulce clásico, realizado en resina cristal translúcida con acabado brillante. Su formato sobredimensionado y sus letras evocan un objeto nostálgico. Disponible en varios colores.",
      "A playful tribute to a beloved candy icon, cast in translucent crystal resin with a glossy finish. Its oversized form and lettering bring a nostalgic note to a display. Available in several colors.",
    ], images: [photo("piece-28-01")],
  },
  {
    id: "piece-29", name: "Paleta de resina", nameEn: "Resin Lollipop Sculpture",
    cat: "esc", designer: "No especificado", origin: "No especificado",
    mat: ["Resina translúcida y acabado brillante", "Translucent resin with a glossy finish"], dim: "37 × 11 cm",
    description: [
      "Escultura colorida inspirada en una paleta: una esfera translúcida sobre una base escultórica y un delgado tallo blanco. Disponible en azul cobalto, verde, amarillo, rosa, rojo, blanco, negro, naranja y morado.",
      "A colorful lollipop-inspired sculpture: a translucent sphere above a sculptural base and slender white stem. Available in cobalt blue, green, yellow, pink, red, white, black, orange, and purple.",
    ], images: [], published: false,
  },
  {
    id: "piece-30", name: "Dado de resina cristal", nameEn: "Crystal Resin Die",
    cat: "esc", designer: "No especificado", origin: "No especificado",
    mat: ["Resina cristal translúcida", "Translucent crystal resin"], dim: "11 × 11 cm",
    description: [
      "Dado escultórico de resina translúcida, inspirado en un juego clásico. Sus bordes redondeados y puntos visibles crean un acento nostálgico. Disponible en gris, blanco, negro, rojo, rosa, naranja, amarillo, verde y azul.",
      "A sculptural die cast in translucent resin and inspired by a classic game. Rounded edges and softly visible pips create a nostalgic accent. Available in gray, white, black, red, pink, orange, yellow, green, and blue.",
    ], images: [photo("piece-30-01")],
  },
  {
    id: "piece-31", name: "Dominó de resina cristal", nameEn: "Crystal Resin Domino",
    cat: "esc", designer: "No especificado", origin: "No especificado",
    mat: ["Resina cristal translúcida", "Translucent crystal resin"], dim: "No especificadas",
    description: [
      "Pieza escultórica inspirada en el dominó, fundida en resina cristal con bordes redondeados y puntos clásicos visibles. Disponible en azul, rosa, rojo, amarillo, gris, transparente, blanco, verde, naranja y negro.",
      "A sculptural piece inspired by dominoes, cast in crystal resin with rounded edges and classic pips throughout. Available in blue, pink, red, yellow, gray, clear, white, green, orange, and black.",
    ], images: [], published: false,
  },
  {
    id: "piece-32", name: "Mati redondo XL", nameEn: "Bord de l’Eau Mati Round XL",
    cat: "esc", designer: "Bord de l’Eau", origin: "No especificado",
    mat: ["Material no especificado", "Material not specified"], dim: "32 cm",
    description: [
      "Pieza decorativa circular con el símbolo Mati, asociado a la protección contra la envidia y la energía negativa. Bord de l’Eau reinterpreta la tradición del ojo protector con una forma contemporánea.",
      "A round decorative piece featuring the Mati symbol, associated with protection from jealousy and negative energy. Bord de l’Eau reinterprets the eye tradition in a postmodern form.",
    ], images: [photo("piece-32-01"), photo("piece-32-02")],
  },
  {
    id: "piece-33", name: "Mati gota grande", nameEn: "Bord de l’Eau Mati Drop Large",
    cat: "esc", designer: "Bord de l’Eau", origin: "No especificado",
    mat: ["Material no especificado", "Material not specified"], dim: "No especificadas",
    description: [
      "Acento decorativo alargado con forma de gota y motivo Mati. El ojo central retoma el símbolo protector en una silueta contemporánea para exhibirse en una repisa o consola.",
      "An elongated drop-shaped accent featuring the Mati motif. Its central eye brings the protective symbol into a contemporary silhouette for a shelf or console.",
    ], images: [photo("piece-33-01")],
  },
  {
    id: "piece-34", name: "Mati redondo XL de aluminio", nameEn: "Bord de l’Eau Mati Round XL Aluminum",
    cat: "esc", designer: "Bord de l’Eau", origin: "No especificado",
    mat: ["Aluminio", "Aluminum"], dim: "32 cm",
    description: [
      "Versión redonda de gran formato en aluminio, con el motivo Mati al centro. Su acabado metálico aporta un contraste luminoso a la imagen tradicional del ojo protector.",
      "A large round aluminum version featuring the Mati motif at its center. Its metallic finish brings a bright contrast to the traditional protective-eye symbol.",
    ], images: [photo("piece-34-01"), photo("piece-34-02")],
  },
  {
    id: "piece-35", name: "Mati gota de aluminio", nameEn: "Bord de l’Eau Mati Drop Aluminum",
    cat: "esc", designer: "Bord de l’Eau", origin: "No especificado",
    mat: ["Aluminio", "Aluminum"], dim: "16 cm",
    description: [
      "Pieza decorativa de aluminio con silueta de gota y símbolo Mati. Su formato compacto reúne el acabado metálico y la forma contemporánea de la colección.",
      "A compact aluminum accent with a drop silhouette and the Mati symbol. It brings together a metallic finish and the collection’s contemporary form.",
    ], images: [photo("piece-35-01")],
  },
  {
    id: "piece-36", name: "Pez XL bronce y blanco", nameEn: "Bord de l’Eau Fish XL Bronze White",
    cat: "esc", designer: "Bord de l’Eau", origin: "No especificado",
    mat: ["Bronce con acabado blanco", "Bronze with white finish"], dim: "30 cm",
    description: [
      "Pieza escultórica en forma de pez, en bronce con acabado blanco. La referencia al símbolo Mati y su escala XL convierten el objeto en un acento protector de presencia gráfica.",
      "A sculptural fish in bronze with a white finish. Its reference to the Mati symbol and XL scale make it a protective accent with a graphic presence.",
    ], images: [photo("piece-36-01")],
  },
  {
    id: "piece-37", name: "Mati redondo XL de cristal", nameEn: "Crystal Mati Round XL",
    cat: "esc", designer: "Galatiss Art Gallery", origin: "No especificado",
    mat: ["Cristal, cordón trenzado y borla", "Crystal, braided cord, and tassel"], dim: "26 cm",
    description: [
      "Acento escultórico de cristal translúcido con el motivo protector Mati en toda su forma redonda. El cordón trenzado y la borla aportan textura y color a esta pieza de Galatiss Art Gallery.",
      "A striking sculptural accent in translucent crystal, featuring the protective Mati motif throughout its rounded form. A braided cord and flowing tassel bring texture and color to this Galatiss Art Gallery piece.",
    ], images: [photo("piece-37-01")],
  },
  {
    id: "piece-38", name: "Charola redonda de acero y piedra volcánica", nameEn: "Round Tray in Steel and Volcanic Stone",
    cat: "esc", designer: "Artesanos mexicanos", origin: "México",
    mat: ["Acero y piedra volcánica", "Steel and volcanic stone"], dim: "45 × 45 × 12 cm",
    description: [
      "Charola escultórica de acero con elementos de piedra volcánica. El contraste entre la estructura metálica y la textura mineral compone un centro de mesa de carácter contemporáneo.",
      "A sculptural steel tray with volcanic stone elements. The contrast between its metal structure and mineral texture creates a contemporary centerpiece.",
    ], images: [photo("piece-38-01")],
  },
  {
    id: "piece-39", name: "Tótem de acero y chuspata", nameEn: "Steel and Chuspata Totem",
    cat: "esc", designer: "Artesanos mexicanos", origin: "México",
    mat: ["Acero y chuspata", "Steel and chuspata"], dim: "Chico: 35 × 35 × 160 cm; mediano: 35 × 35 × 170 cm; grande: 35 × 35 × 210 cm",
    description: [
      "Composición vertical de recipientes tejidos en chuspata y detalles de acero. La repetición de formas y la combinación de materiales naturales y metálicos dan ritmo y altura a un espacio.",
      "A vertical composition of woven chuspata vessels with steel details. Repeated forms and a mix of natural and metallic materials bring rhythm and height to a space.",
    ], images: [photo("piece-39-01")],
  },
  {
    id: "piece-40", name: "Imperial Trooper", nameEn: "Imperial Trooper",
    cat: "arte", designer: "Artista mexicano", origin: "México",
    mat: ["Óleo sobre lienzo, enmarcado en vidrio", "Oil on canvas, framed in glass"], dim: "60 × 82 cm",
    description: [
      "Retrato pintado a mano por un artista mexicano que combina ciencia ficción con la elegancia de la pintura clásica. Un Imperial Trooper aparece con gorguera escultórica y capa marfil, enmarcado tras vidrio.",
      "A hand-painted portrait by a Mexican artist, blending science fiction with the elegance of old-world portraiture. An Imperial Trooper wears a sculptural ruff and ivory cape, presented behind glass.",
    ], images: [photo("piece-40-01")],
  },
];

export const BASE_CATALOG_PIECES: Piece[] = [...ORIGINAL_CATALOG.map(piece => {
  if (piece.id === "piece-23") return { ...piece, images: [photo("piece-23-01")] };
  const photos = CATALOG_NEW_PHOTOS[piece.id];
  return photos ? { ...piece, images: [...photos, ...(piece.images ?? [])], published: true } : piece;
}), ...CATALOG_ADDITIONS];

export const CATALOG_PIECES: Piece[] = applyProductUpdates(BASE_CATALOG_PIECES);
