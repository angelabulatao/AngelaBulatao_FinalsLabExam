/* Destination catalogue. `img` is an Unsplash photo id; the app builds the URL. */
const DESTINATIONS = [
  {id:'palawan',name:'El Nido, Palawan',country:'Philippines',region:'ph',category:'Beach',img:'photo-1507525428034-b723cf961d3e',featured:true,season:'November to May',desc:'Limestone cliffs, hidden lagoons and island-hopping routes A to D.'},
  {id:'siargao',name:'Siargao',country:'Philippines',region:'ph',category:'Island',img:'photo-1519046904884-53103b34b206',featured:true,season:'March to October',desc:'Surf breaks at Cloud 9, tidal pools and coconut-lined roads.'},
  {id:'banaue',name:'Banaue Rice Terraces',country:'Philippines',region:'ph',category:'Culture',img:'photo-1528181304800-259b08848526',featured:true,season:'March to June',desc:'2,000-year-old terraces carved into the Ifugao mountains.'},
  {id:'batanes',name:'Batanes',country:'Philippines',region:'ph',category:'Mountain',img:'photo-1506905925346-21bda4d32df4',season:'March to June',desc:'Rolling green hills, stone houses and the open Pacific.'},
  {id:'mayon',name:'Mayon Volcano, Albay',country:'Philippines',region:'ph',category:'Mountain',img:'photo-1464822759023-fed622ff2c3b',season:'February to May',desc:'A near-perfect cone rising above Legazpi.'},
  {id:'vigan',name:'Vigan',country:'Philippines',region:'ph',category:'Culture',img:'photo-1548013146-72479768bada',season:'November to April',desc:'Cobblestone Calle Crisologo and Spanish-era mansions.'},
  {id:'chocolate',name:'Chocolate Hills, Bohol',country:'Philippines',region:'ph',category:'Nature',img:'photo-1500382017468-9049fed747ef',season:'December to May',desc:'Over a thousand grassy mounds that turn brown in dry season.'},
  {id:'coron',name:'Coron, Palawan',country:'Philippines',region:'ph',category:'Island',img:'photo-1473116763249-2faaef81ccda',season:'November to May',desc:'Kayangan Lake, wreck dives and sheer limestone walls.'},
  {id:'kyoto',name:'Kyoto',country:'Japan',region:'intl',category:'Culture',img:'photo-1493976040374-85c6e12f0e8f',featured:false,season:'March–April, November',desc:'Wooden machiya streets, torii gates and tea houses.'},
  {id:'santorini',name:'Santorini',country:'Greece',region:'intl',category:'Island',img:'photo-1570077188670-e3a8d69ac5ff',season:'May to October',desc:'White-washed villages on a caldera edge, sunsets in Oia.'},
  {id:'swiss',name:'Swiss Alps',country:'Switzerland',region:'intl',category:'Mountain',img:'photo-1531366936337-7c912a4589a7',season:'June to September',desc:'Alpine trains, glacier lakes and meadow hikes.'},
  {id:'bali',name:'Ubud, Bali',country:'Indonesia',region:'intl',category:'Nature',img:'photo-1537996194471-e657df975ab4',season:'April to October',desc:'Rice paddies, jungle temples and slow mornings.'},
  {id:'lisbon',name:'Lisbon',country:'Portugal',region:'intl',category:'City',img:'photo-1513735492246-483525079686',season:'April to October',desc:'Tiled hillsides, yellow trams and late dinners.'},
  {id:'nyc',name:'New York City',country:'United States',region:'intl',category:'City',img:'photo-1480714378408-67cf0d13bc1b',season:'April–June, September–November',desc:'Five boroughs of skyline, food and museums.'},
  {id:'maldives',name:'Maldives',country:'Maldives',region:'intl',category:'Beach',img:'photo-1514282401047-d79a71a590e8',season:'November to April',desc:'Overwater villas and house reefs in clear water.'},
  {id:'iceland',name:'Iceland Ring Road',country:'Iceland',region:'intl',category:'Nature',img:'photo-1504893524553-b855bce32c67',season:'June to August',desc:'Waterfalls, black sand and a loop around the island.'}
];
