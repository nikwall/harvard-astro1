/* Videos, outside readings and interactive tools for every lesson page.
   Every YouTube id below was checked (exists, embeddable) on 2026-11-10.
   Keys of `sections` match the section number shown in the lesson heading (e.g. "2.3", "4.1–4.2"). */
(function () {
  const V = {
    // Crash Course Astronomy (Phil Plait), the backbone video series
    cc01: ["0rHUDWjR5gg", "Introduction to Astronomy", "Crash Course Astronomy #1", "12:12"],
    cc02: ["L-Wtlev6suc", "Naked Eye Observations", "Crash Course Astronomy #2", "11:17"],
    cc03: ["01QWC-rZcfE", "Cycles in the Sky", "Crash Course Astronomy #3", "9:29"],
    cc04: ["AQ5vty8f9Xc", "Moon Phases", "Crash Course Astronomy #4", "9:46"],
    cc05: ["PRgua7xceDA", "Eclipses", "Crash Course Astronomy #5", "10:32"],
    cc06: ["mYhy7eaazIk", "Telescopes", "Crash Course Astronomy #6", "12:00"],
    cc07: ["TRAbZxQHlVw", "The Gravity of the Situation", "Crash Course Astronomy #7", "10:03"],
    cc08: ["KlWpFLfLFBI", "Tides", "Crash Course Astronomy #8", "9:47"],
    cc09: ["TKM0P3XlMNA", "Introduction to the Solar System", "Crash Course Astronomy #9", "10:17"],
    cc10: ["b22HKFMIfWo", "The Sun", "Crash Course Astronomy #10", "12:04"],
    cc11: ["w-9gDALvMF4", "The Earth", "Crash Course Astronomy #11", "10:14"],
    cc12: ["mCzchPx3yF8", "The Moon", "Crash Course Astronomy #12", "9:51"],
    cc13: ["P3GkZe3nRQ0", "Mercury", "Crash Course Astronomy #13", "10:18"],
    cc14: ["ZFUgy3crCYY", "Venus", "Crash Course Astronomy #14", "10:50"],
    cc15: ["I-88YWx71gE", "Mars", "Crash Course Astronomy #15", "10:12"],
    cc16: ["Xwn8fQSW7-8", "Jupiter", "Crash Course Astronomy #16", "10:43"],
    cc17: ["HaFaf7vbgpE", "Jupiter's Moons", "Crash Course Astronomy #17", "10:30"],
    cc18: ["E8GNde5nCSg", "Saturn", "Crash Course Astronomy #18", "12:16"],
    cc19: ["1hIwD17Crko", "Uranus & Neptune", "Crash Course Astronomy #19", "12:19"],
    cc20: ["auxpcdQimCs", "Asteroids", "Crash Course Astronomy #20", "11:33"],
    cc21: ["yB9HHyPpKds", "Comets", "Crash Course Astronomy #21", "11:55"],
    cc22: ["ZJscxTyI__s", "The Oort Cloud", "Crash Course Astronomy #22", "11:41"],
    cc23: ["TuDfZ2Md5x8", "Meteors", "Crash Course Astronomy #23", "11:22"],
    cc24: ["jjy-eqWM38g", "Light", "Crash Course Astronomy #24", "10:34"],
    cc25: ["CWMh61yutjU", "Distances", "Crash Course Astronomy #25", "11:21"],
    cc26: ["ld75W1dz-h0", "Stars", "Crash Course Astronomy #26", "10:41"],
    cc27: ["7ATtD8x7vV0", "Exoplanets", "Crash Course Astronomy #27", "11:50"],
    cc28: ["4zKVx29_A1w", "Brown Dwarfs", "Crash Course Astronomy #28", "11:06"],
    cc29: ["jfvMtCHv1q4", "Low Mass Stars", "Crash Course Astronomy #29", "12:03"],
    cc30: ["Mj06h8BeeOA", "White Dwarfs & Planetary Nebulae", "Crash Course Astronomy #30", "11:10"],
    cc31: ["PWx9DurgPn8", "High Mass Stars", "Crash Course Astronomy #31", "12:17"],
    cc32: ["RrMvUL8HFlM", "Neutron Stars", "Crash Course Astronomy #32", "12:57"],
    cc33: ["qZWPBKULkdQ", "Black Holes", "Crash Course Astronomy #33", "12:26"],
    cc34: ["pIFiCLhJmig", "Binary and Multiple Stars", "Crash Course Astronomy #34", "12:01"],
    cc35: ["an4rgJ3O21A", "Star Clusters", "Crash Course Astronomy #35", "10:36"],
    cc36: ["W8UI7F43_Yk", "Nebulae", "Crash Course Astronomy #36", "12:16"],
    cc37: ["tj_QPnO8vpQ", "The Milky Way", "Crash Course Astronomy #37", "11:14"],
    cc38: ["I82ADyJC7wE", "Galaxies, part 1", "Crash Course Astronomy #38", "12:06"],
    cc39: ["_O2sg-PGhEg", "Galaxies, part 2", "Crash Course Astronomy #39", "15:35"],
    cc40: ["Z2zA9nPFN5A", "Gamma-Ray Bursts", "Crash Course Astronomy #40", "14:05"],
    cc41: ["9W3RsaWuCuE", "Dark Matter", "Crash Course Astronomy #41", "12:00"],
    cc42: ["9B7Ix2VQEGo", "The Big Bang (Cosmology part 1)", "Crash Course Astronomy #42", "13:23"],
    cc43: ["gzLM6ltw3l0", "Dark Energy (Cosmology part 2)", "Crash Course Astronomy #43", "11:23"],
    cc44: ["IGCVTSQw7WU", "A Brief History of the Universe", "Crash Course Astronomy #44", "12:36"],
    cc45: ["jDF-N3A60DE", "Deep Time", "Crash Course Astronomy #45", "15:15"],
    cc46: ["mgdq6DOTU3M", "Everything, the Universe… and Life", "Crash Course Astronomy #46", "11:23"],
    // Other channels
    powers10: ["0fKBhvDjuy0", "Powers of Ten (1977)", "Eames Office", "9:01"],
    hubbleDave: ["LqBcl1RKexI", "Edwin Hubble, Doppler Shift, and the Expanding Universe", "Professor Dave Explains", "8:11"],
    seasons: ["DD_8Jm5pTLk", "Reasons for the seasons", "TED-Ed", "5:21"],
    retro: ["sBzGGoBQVDA", "Apparent Retrograde Motion (Visual Explanation)", "ScienceWorld", "2:43"],
    newAstro: ["-FYvy3_egHw", "The New Astronomy", "Crash Course History of Science #13", "12:35"],
    erato: ["G8cbIWMv0rI", "Eratosthenes measures the Earth", "Carl Sagan, Cosmos", "6:42"],
    kepler: ["wjOOrr2uPuU", "Solar System Dynamics: Orbits and Kepler's Laws", "NASA Solar System", "6:55"],
    newtonGrav: ["7gf6YpdvtE0", "Newtonian Gravity", "Crash Course Physics #8", "9:20"],
    tidesTed: ["mpRJhhbKLFc", "Why are there two tides a day?", "TED-Ed", "5:21"],
    spectra: ["1uPyq63aRvg", "Emission and Absorption Spectra", "Bozeman Science", "5:18"],
    blackbody: ["DHG61XPuWyk", "Blackbody radiation", "Khan Academy", "14:18"],
    spaceTel: ["csIry_3pbDU", "How does a Space Telescope work? (Hubble and Webb)", "Jared Owen", "19:35"],
    ss101: ["libKVRa01L8", "Solar System 101", "National Geographic", "4:11"],
    planetForm: ["sCkhEu3lYNc", "Formation of the Planets", "Lincoln Learning Solutions", "3:29"],
    radiometric: ["oe45GegJUvM", "How Does Radiometric Dating Work?", "Ars Technica", "4:38"],
    tectonics: ["kwfNGatxUJI", "Plate Tectonics Explained", "MinuteEarth", "2:37"],
    greenhouse: ["SN5-DnOHQmE", "What Is the Greenhouse Effect?", "NASA Space Place", "2:30"],
    europa: ["kz9VhCQbPAk", "Europa: Ocean World", "NASA JPL", "4:13"],
    rings: ["N1Fp7ZaopJc", "Why does Saturn have rings?", "SciShow", "2:33"],
    pluto: ["iIk29MnzZWA", "Why is Pluto not a planet?", "BBC News", "3:32"],
    chicxulub: ["vq3nWnTkFbk", "Experience the Disaster that Wiped Out Dinosaurs", "Science Channel", "4:37"],
    transit: ["wQySNy3Trzk", "How Winking Stars Point Us To Distant Worlds", "NASA Goddard", "1:02"],
    rv: ["1mqMyn06zAY", "Searching for Exoplanets: Astrometric vs. Radial Velocity", "Monash Physics & Astronomy", "4:31"],
    fusion: ["W1ZQ4JBv3-Y", "How Does Fusion Power the Sun?", "Science Channel", "2:00"],
    spaceWx: ["HJfy8acFaOg", "Space Weather and Earth's Aurora", "NASA", "4:49"],
    parallax: ["iwlMmJs1f5o", "Stellar parallax and measuring distance", "Las Cumbres Observatory", "1:58"],
    hrRog: ["o7TjUW1yUL0", "Stars and the H-R Diagram", "Royal Observatory Greenwich", "3:06"],
    hrDave: ["Y5VU3Mp6abI", "Classification of Stars: Spectral Analysis and the H-R Diagram", "Professor Dave Explains", "7:05"],
    cannon: ["51JSzU53z4Q", "Who Was Annie Jump Cannon?", "Museum of Science", "2:49"],
    lifecycle: ["PM9CQDlQI0A", "The Life Cycle of Stars", "Institute of Physics", "5:00"],
    nsKurz: ["udFxKZRyQt4", "Neutron Stars – the most extreme things that are not black holes", "Kurzgesagt", "7:26"],
    bhKurz: ["e-P5IFTqB98", "Black Holes Explained – From Birth to Death", "Kurzgesagt", "5:56"],
    gw: ["iphcyNWFD10", "The Absurdity of Detecting Gravitational Waves", "Veritasium", "9:07"],
    hypernova: ["q4DF3j4saCE", "The Most Extreme Explosion in the Universe", "Kurzgesagt", "9:29"],
    cosmicRays: ["91801Y1lsCg", "How cosmic rays help us understand the universe", "TED-Ed", "4:40"],
    sgrA: ["DRCD-zx5QFA", "Zooming into Sagittarius A*", "European Southern Observatory", "1:35"],
    bhImage: ["S_GVbuddri8", "First Image of a Black Hole!", "Veritasium", "5:29"],
    galaxyGuide: ["VXcnG06GmcY", "Hubble's Field Guide to Galaxies", "NASA Goddard", "3:53"],
    leavitt: ["2FrY6gRPC7k", "Who Was Henrietta Leavitt?", "SciShow", "3:57"],
    quasars: ["V4Z8EdiJxgk", "The Black Hole That Kills Galaxies – Quasars", "Kurzgesagt", "10:50"],
    bigBangKurz: ["wNDGgL73ihY", "The Beginning of Everything – The Big Bang", "Kurzgesagt", "5:55"],
    cmb: ["3tCMd1ytvWg", "Cosmic Microwave Background Explained", "PBS Space Time", "7:10"],
    inflation: ["_llA2q1rlSg", "Cosmic Inflation Explained", "PHD Comics", "3:43"],
    darkNight: ["gxJ4M7tyLRE", "Why is it Dark at Night?", "minutephysics", "3:53"],
    dmde: ["QAa2O_8wBUQ", "What is Dark Matter and Dark Energy?", "Kurzgesagt", "6:21"],
    cosmicWeb: ["7V0WglxhhrQ", "The Cosmic Web Explained", "Perimeter Institute", "5:52"],
    accel: ["tXkBfkeJJ5c", "How Do We Know The Universe Is Accelerating?", "minutephysics", "3:27"],
    originLife: ["de1hiS_XjWg", "The mysterious origins of life on Earth", "TED-Ed", "4:57"],
    hz: ["J04YN9azln8", "What Is the Habitable Zone?", "NASA", "2:21"],
    drake: ["6AnLznzIjSE", "Calculating the odds of intelligent alien life", "TED-Ed (Jill Tarter)", "7:27"],
    fermi: ["sNhhvQGsMEc", "The Fermi Paradox — Where Are All The Aliens?", "Kurzgesagt", "6:21"],
  };

  // OpenStax Astronomy 2e (free, peer-reviewed, CC BY): a second textbook explanation for every topic.
  const OS = "https://openstax.org/books/astronomy-2e/pages/";
  const os = (slug, title) => ({ kind: "read", url: OS + slug, title: "OpenStax Astronomy 2e · " + title });

  // Simulations and live data
  const T = {
    stellarium: { kind: "try", url: "https://stellarium-web.org/", title: "Stellarium Web: a planetarium in your browser" },
    naapSeasons: { kind: "try", url: "https://astro.unl.edu/naap/motion1/motion1.html", title: "NAAP lab: Basic coordinates & seasons (UNL)" },
    naapLunar: { kind: "try", url: "https://astro.unl.edu/naap/lps/lps.html", title: "NAAP lab: Lunar phases simulator (UNL)" },
    naapSsm: { kind: "try", url: "https://astro.unl.edu/naap/ssm/ssm.html", title: "NAAP lab: Solar system models & retrograde motion (UNL)" },
    naapPos: { kind: "try", url: "https://astro.unl.edu/naap/pos/pos.html", title: "NAAP lab: Planetary orbit simulator, Kepler's laws (UNL)" },
    phetKepler: { kind: "try", url: "https://phet.colorado.edu/en/simulations/keplers-laws", title: "PhET: Kepler's Laws" },
    phetOrbits: { kind: "try", url: "https://phet.colorado.edu/en/simulations/gravity-and-orbits", title: "PhET: Gravity and Orbits" },
    phetMySS: { kind: "try", url: "https://phet.colorado.edu/en/simulations/my-solar-system", title: "PhET: My Solar System" },
    phetBB: { kind: "try", url: "https://phet.colorado.edu/en/simulations/blackbody-spectrum", title: "PhET: Blackbody Spectrum" },
    phetH: { kind: "try", url: "https://phet.colorado.edu/en/simulations/models-of-the-hydrogen-atom", title: "PhET: Models of the Hydrogen Atom" },
    naapH: { kind: "try", url: "https://astro.unl.edu/naap/hydrogen/hydrogen.html", title: "NAAP lab: Hydrogen atom & spectral lines (UNL)" },
    naapBB: { kind: "try", url: "https://astro.unl.edu/naap/blackbody/blackbody.html", title: "NAAP lab: Blackbody curves (UNL)" },
    aladin: { kind: "try", url: "https://aladin.cds.unistra.fr/AladinLite/", title: "Aladin Lite: browse real sky surveys (same tool as Aladin Desktop)" },
    phetGreen: { kind: "try", url: "https://phet.colorado.edu/en/simulations/greenhouse-effect", title: "PhET: The Greenhouse Effect" },
    nasaSS: { kind: "try", url: "https://science.nasa.gov/solar-system/", title: "NASA Science: Solar System" },
    cneos: { kind: "try", url: "https://cneos.jpl.nasa.gov/", title: "NASA/JPL CNEOS: near-Earth objects & planetary defense" },
    eyesExo: { kind: "try", url: "https://eyes.nasa.gov/apps/exo/", title: "NASA Eyes on Exoplanets (3D)" },
    naapExo: { kind: "try", url: "https://astro.unl.edu/naap/esp/esp.html", title: "NAAP lab: Exoplanet radial velocity & transit simulator (UNL)" },
    exoArchive: { kind: "try", url: "https://exoplanetarchive.ipac.caltech.edu/", title: "NASA Exoplanet Archive (real data)" },
    nasaExo: { kind: "try", url: "https://science.nasa.gov/exoplanets/", title: "NASA Science: Exoplanets" },
    sdo: { kind: "try", url: "https://sdo.gsfc.nasa.gov/data/", title: "Solar Dynamics Observatory: today's Sun" },
    swpc: { kind: "try", url: "https://www.swpc.noaa.gov/", title: "NOAA Space Weather Prediction Center" },
    gaia: { kind: "try", url: "https://www.cosmos.esa.int/web/gaia", title: "ESA Gaia mission" },
    naapHR: { kind: "try", url: "https://astro.unl.edu/naap/hr/hr.html", title: "NAAP lab: HR diagram explorer (UNL)" },
    naapVsp: { kind: "try", url: "https://astro.unl.edu/naap/vsp/vsp.html", title: "NAAP lab: Variable star photometry (UNL)" },
    dasch: { kind: "try", url: "https://platestacks.cfa.harvard.edu/", title: "Harvard plate stacks & DASCH: the glass plates" },
    ligo: { kind: "try", url: "https://www.ligo.caltech.edu/page/what-are-gw", title: "LIGO: what are gravitational waves?" },
    eht: { kind: "try", url: "https://eventhorizontelescope.org/", title: "Event Horizon Telescope" },
    gzoo: { kind: "try", url: "https://www.zooniverse.org/projects/zookeeper/galaxy-zoo/", title: "Galaxy Zoo: classify real galaxies" },
    webb: { kind: "try", url: "https://science.nasa.gov/mission/webb/", title: "NASA: James Webb Space Telescope" },
    planck: { kind: "try", url: "https://www.esa.int/Science_Exploration/Space_Science/Planck", title: "ESA Planck: the CMB mission" },
    wmap: { kind: "try", url: "https://map.gsfc.nasa.gov/universe/", title: "NASA WMAP: Universe 101" },
    naapHZ: { kind: "try", url: "https://astro.unl.edu/naap/habitablezones/habitablezones.html", title: "NAAP lab: Habitable zones (UNL)" },
  };

  const M = {
    ch01: {
      intro: ["cc01"],
      sections: {
        "1.1": ["powers10", os("1-4-numbers-in-astronomy", "1.4 Numbers in astronomy"), os("1-5-consequences-of-light-travel-time", "1.5 Light travel time"), os("1-6-a-tour-of-the-universe", "1.6 A tour of the universe")],
        "1.2": ["cc44", "cc45", os("1-7-the-universe-on-the-large-scale", "1.7 The universe on the large scale")],
        "1.3": ["hubbleDave", os("26-5-the-expanding-universe", "26.5 The expanding universe")],
      },
    },
    ch02: {
      intro: ["cc02"],
      sections: {
        "2.1": ["cc03", os("2-1-the-sky-above", "2.1 The sky above"), T.stellarium],
        "2.2": ["seasons", os("4-2-the-seasons", "4.2 The seasons"), os("4-1-earth-and-sky", "4.1 Earth and sky"), T.naapSeasons],
        "2.3": ["cc04", "cc05", os("4-5-phases-and-motions-of-the-moon", "4.5 Phases of the Moon"), os("4-7-eclipses-of-the-sun-and-moon", "4.7 Eclipses"), T.naapLunar],
        "2.4": ["retro", os("2-2-ancient-astronomy", "2.2 Ancient astronomy"), T.naapSsm],
      },
    },
    ch03: {
      intro: ["newAstro"],
      sections: {
        "3.1–3.2": ["erato", os("2-2-ancient-astronomy", "2.2 Ancient astronomy")],
        "3.3": ["kepler", os("2-4-the-birth-of-modern-astronomy", "2.4 The birth of modern astronomy"), os("3-1-the-laws-of-planetary-motion", "3.1 Kepler's laws"), T.phetKepler, T.naapPos],
        "3.4": [os("1-2-the-nature-of-science", "1.2 The nature of science"), os("2-3-astrology-and-astronomy", "2.3 Astrology and astronomy")],
      },
    },
    ch04: {
      intro: ["cc07"],
      sections: {
        "4.1–4.2": [os("3-2-newtons-great-synthesis", "3.2 Newton's great synthesis")],
        "4.3": [os("3-4-orbits-in-the-solar-system", "3.4 Orbits in the solar system"), os("3-5-motions-of-satellites-and-spacecraft", "3.5 Satellites & spacecraft"), T.phetOrbits],
        "4.4": ["newtonGrav", "cc08", "tidesTed", os("3-3-newtons-universal-law-of-gravitation", "3.3 Universal gravitation"), os("4-6-ocean-tides-and-the-moon", "4.6 Ocean tides"), T.phetMySS],
      },
    },
    ch05: {
      intro: ["cc24"],
      sections: {
        "5.1": [os("5-1-the-behavior-of-light", "5.1 The behavior of light"), os("5-2-the-electromagnetic-spectrum", "5.2 The EM spectrum"), os("5-4-the-structure-of-the-atom", "5.4 Structure of the atom")],
        "5.2": ["spectra", "blackbody", os("5-3-spectroscopy-in-astronomy", "5.3 Spectroscopy"), os("5-5-formation-of-spectral-lines", "5.5 Spectral lines"), os("5-6-the-doppler-effect", "5.6 The Doppler effect"), T.phetBB, T.phetH, T.naapH],
        "5.3": ["cc06", "spaceTel", os("6-1-telescopes", "6.1 Telescopes"), os("6-3-visible-light-detectors-and-instruments", "6.3 Detectors"), os("6-5-observations-outside-earths-atmosphere", "6.5 Observing from space"), T.aladin, T.webb],
      },
    },
    ch06: {
      intro: ["cc09"],
      sections: {
        "6.1": ["ss101", os("7-1-overview-of-our-planetary-system", "7.1 Overview of our planetary system"), T.nasaSS],
        "6.2–6.3": ["planetForm", os("7-4-origin-of-the-solar-system", "7.4 Origin of the solar system"), os("14-3-formation-of-the-solar-system", "14.3 Formation of the solar system")],
        "6.4": ["radiometric", os("7-3-dating-planetary-surfaces", "7.3 Dating planetary surfaces")],
      },
    },
    ch07: {
      intro: ["cc11"],
      sections: {
        "7.1": ["tectonics", os("8-1-the-global-perspective", "8.1 The global perspective"), os("8-2-earths-crust", "8.2 Earth's crust"), os("8-3-earths-atmosphere", "8.3 Earth's atmosphere")],
        "7.2–7.4": ["cc12", "cc13", "cc14", "cc15", os("9-3-impact-craters", "9.3 Impact craters"), os("10-6-divergent-planetary-evolution", "10.6 Divergent planetary evolution")],
        "7.5": ["greenhouse", os("8-4-life-chemical-evolution-and-climate-change", "8.4 Life & climate change"), T.phetGreen],
      },
    },
    ch08: {
      intro: ["cc16"],
      sections: {
        "8.1": ["cc18", "cc19", os("11-2-the-giant-planets", "11.2 The giant planets"), os("11-3-atmospheres-of-the-giant-planets", "11.3 Giant-planet atmospheres")],
        "8.2": ["cc17", "europa", os("12-2-the-galilean-moons-of-jupiter", "12.2 The Galilean moons"), os("12-3-titan-and-triton", "12.3 Titan and Triton")],
        "8.3": ["rings", os("12-5-planetary-rings-and-enceladus", "12.5 Planetary rings (and Enceladus)")],
      },
    },
    ch09: {
      intro: ["cc20"],
      sections: {
        "9.1": [os("13-1-asteroids", "13.1 Asteroids")],
        "9.2": ["cc23", os("14-1-meteors", "14.1 Meteors"), os("14-2-meteorites-stones-from-heaven", "14.2 Meteorites")],
        "9.3": ["cc21", "cc22", os("13-3-the-long-haired-comets", "13.3 Comets"), os("13-4-the-origin-and-fate-of-comets-and-related-objects", "13.4 Origin & fate of comets")],
        "9.4": ["pluto", os("12-4-pluto-and-charon", "12.4 Pluto and Charon")],
        "9.5": ["chicxulub", os("13-2-asteroids-and-planetary-defense", "13.2 Planetary defense"), os("8-5-cosmic-influences-on-the-evolution-of-earth", "8.5 Cosmic influences on Earth"), T.cneos],
      },
    },
    ch10: {
      intro: ["cc27"],
      sections: {
        "10.1": ["transit", "rv", os("21-4-planets-beyond-the-solar-system-search-and-discovery", "21.4 Search & discovery"), T.naapExo, T.eyesExo],
        "10.2": [os("21-5-exoplanets-everywhere-what-we-are-learning", "21.5 Exoplanets everywhere"), T.exoArchive, T.nasaExo],
        "10.3": [os("21-6-new-perspectives-on-planet-formation", "21.6 New perspectives on planet formation"), os("14-4-comparison-with-other-planetary-systems", "14.4 Comparison with other systems")],
      },
    },
    ch11: {
      intro: ["cc10"],
      sections: {
        "11.1": [os("15-1-the-structure-and-composition-of-the-sun", "15.1 Structure & composition of the Sun"), os("16-1-sources-of-sunshine-thermal-and-gravitational-energy", "16.1 Sources of sunshine")],
        "11.2": ["fusion", os("16-2-mass-energy-and-the-theory-of-relativity", "16.2 Mass, energy & relativity"), os("16-3-the-solar-interior-theory", "16.3 Solar interior: theory"), os("16-4-the-solar-interior-observations", "16.4 Solar interior: observations")],
        "11.3": ["spaceWx", os("15-2-the-solar-cycle", "15.2 The solar cycle"), os("15-4-space-weather", "15.4 Space weather"), T.sdo, T.swpc],
      },
    },
    ch12: {
      intro: ["cc26"],
      sections: {
        "12.1": ["cc25", "parallax", "cc34", os("17-1-the-brightness-of-stars", "17.1 Brightness of stars"), os("17-2-colors-of-stars", "17.2 Colors of stars"), os("18-2-measuring-stellar-masses", "18.2 Stellar masses"), os("19-2-surveying-the-stars", "19.2 Parallax"), T.gaia],
        "12.2": ["hrRog", "hrDave", "cannon", os("17-3-the-spectra-of-stars-and-brown-dwarfs", "17.3 Spectra of stars"), os("18-4-the-h-r-diagram", "18.4 The H–R diagram"), T.naapHR, T.dasch],
        "12.3": ["cc35", os("22-2-star-clusters", "22.2 Star clusters"), os("19-4-the-h-r-diagram-and-cosmic-distances", "19.4 H–R diagram & distances")],
      },
    },
    ch13: {
      intro: ["lifecycle"],
      sections: {
        "13.1": ["cc36", "cc28", os("21-1-star-formation", "21.1 Star formation"), os("21-2-the-h-r-diagram-and-the-study-of-stellar-evolution", "21.2 H–R diagram & stellar evolution")],
        "13.2": ["cc29", os("22-1-evolution-from-the-main-sequence-to-red-giants", "22.1 Main sequence → red giant"), os("22-4-further-evolution-of-stars", "22.4 Further evolution of stars")],
        "13.3": ["cc31", os("22-5-the-evolution-of-more-massive-stars", "22.5 Massive stars"), os("23-2-evolution-of-massive-stars-an-explosive-finish", "23.2 An explosive finish")],
      },
    },
    ch14: {
      intro: ["cc30"],
      sections: {
        "14.1": [os("23-1-the-death-of-low-mass-stars", "23.1 Death of low-mass stars"), os("23-5-the-evolution-of-binary-star-systems", "23.5 Binary star evolution")],
        "14.2": ["cc32", "nsKurz", os("23-4-pulsars-and-the-discovery-of-neutron-stars", "23.4 Pulsars & neutron stars")],
        "14.3": ["cc33", "bhKurz", os("24-1-introducing-general-relativity", "24.1 General relativity"), os("24-5-black-holes", "24.5 Black holes"), os("24-6-evidence-for-black-holes", "24.6 Evidence for black holes")],
        "14.4": ["cc40", "gw", "hypernova", os("23-3-supernova-observations", "23.3 Supernova observations"), os("23-6-the-mystery-of-the-gamma-ray-bursts", "23.6 Gamma-ray bursts"), os("24-7-gravitational-wave-astronomy", "24.7 Gravitational waves"), T.ligo],
      },
    },
    ch15: {
      intro: ["cc37"],
      sections: {
        "15.1": [os("25-1-the-architecture-of-the-galaxy", "25.1 Architecture of the Galaxy"), os("25-2-spiral-structure", "25.2 Spiral structure"), os("25-3-the-mass-of-the-galaxy", "25.3 Mass of the Galaxy")],
        "15.2": ["cc36", "cosmicRays", os("20-1-the-interstellar-medium", "20.1 The interstellar medium"), os("20-4-cosmic-rays", "20.4 Cosmic rays"), os("20-5-the-life-cycle-of-cosmic-material", "20.5 Life cycle of cosmic material")],
        "15.3–15.4": ["sgrA", "bhImage", os("25-4-the-center-of-the-galaxy", "25.4 The galactic center"), os("25-5-stellar-populations-in-the-galaxy", "25.5 Stellar populations"), os("25-6-the-formation-of-the-galaxy", "25.6 Formation of the Galaxy"), T.eht],
      },
    },
    ch16: {
      intro: ["cc38"],
      sections: {
        "16.1": ["galaxyGuide", os("26-1-the-discovery-of-galaxies", "26.1 Discovery of galaxies"), os("26-2-types-of-galaxies", "26.2 Types of galaxies"), T.gzoo],
        "16.2": ["leavitt", "hubbleDave", os("19-3-variable-stars-one-key-to-cosmic-distances", "19.3 Variable stars"), os("26-4-the-extragalactic-distance-scale", "26.4 Extragalactic distance scale"), os("26-5-the-expanding-universe", "26.5 The expanding universe"), T.naapVsp],
        "16.3": ["cc39", os("28-1-observations-of-distant-galaxies", "28.1 Distant galaxies"), os("28-2-galaxy-mergers-and-active-galactic-nuclei", "28.2 Mergers & AGN")],
        "16.4": ["quasars", os("27-1-quasars", "27.1 Quasars"), os("27-2-supermassive-black-holes-what-quasars-really-are", "27.2 Supermassive black holes")],
      },
    },
    ch17: {
      intro: ["cc42"],
      sections: {
        "17.1": ["bigBangKurz", "cc44", os("29-1-the-age-of-the-universe", "29.1 Age of the universe"), os("29-3-the-beginning-of-the-universe", "29.3 The beginning of the universe")],
        "17.2": ["cmb", os("29-4-the-cosmic-microwave-background", "29.4 The CMB"), T.planck, T.wmap],
        "17.3–17.4": ["inflation", "darkNight", os("29-6-the-inflationary-universe", "29.6 Inflation"), os("29-7-the-anthropic-principle", "29.7 The anthropic principle")],
      },
    },
    ch18: {
      intro: ["cc41"],
      sections: {
        "18.1–18.2": ["dmde", os("25-3-the-mass-of-the-galaxy", "25.3 Mass of the Galaxy"), os("28-4-the-challenge-of-dark-matter", "28.4 The challenge of dark matter")],
        "18.3": ["cosmicWeb", os("28-3-the-distribution-of-galaxies-in-space", "28.3 Distribution of galaxies"), os("28-5-the-formation-and-evolution-of-galaxies-and-structure-in-the-universe", "28.5 Formation of structure")],
        "18.4": ["cc43", "accel", os("29-2-a-model-of-the-universe", "29.2 A model of the universe"), os("29-5-what-is-the-universe-really-made-of", "29.5 What is the universe made of?")],
      },
    },
    ch19: {
      intro: ["cc46"],
      sections: {
        "19.1": ["originLife", os("30-1-the-cosmic-context-for-life", "30.1 Cosmic context for life"), os("30-2-astrobiology", "30.2 Astrobiology")],
        "19.2": ["europa", os("30-3-searching-for-life-beyond-earth", "30.3 Searching for life beyond Earth")],
        "19.3": ["hz", os("30-3-searching-for-life-beyond-earth", "30.3 Habitable planets"), T.naapHZ],
        "19.4–19.5": ["drake", "fermi", os("30-4-the-search-for-extraterrestrial-intelligence", "30.4 SETI")],
      },
    },
  };

  function video(key) {
    const v = V[key];
    if (!v) { console.warn("unknown video", key); return null; }
    return { kind: "video", id: v[0], title: v[1], source: v[2], dur: v[3] };
  }
  function resolve(list) {
    return (list || []).map((x) => (typeof x === "string" ? video(x) : x)).filter(Boolean);
  }
  const norm = (s) => String(s || "").replace(/[‐-―-]/g, "-").replace(/\s+/g, "");
  window.MEDIA = {
    intro: (ch) => resolve((M[ch] || {}).intro),
    section: (ch, key) => {
      const secs = (M[ch] || {}).sections || {};
      const k = Object.keys(secs).find((x) => norm(x) === norm(key));
      return resolve(k ? secs[k] : []);
    },
    playlist: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtPAJr1ysd5yGIyiSFuh0mIL",
    openstax: OS + "1-introduction",
  };
})();
