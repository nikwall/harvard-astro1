/* Lecture recaps, written from the lecture slide decks in the course folder (course material/course_files_export/Astro1_L*.pdf).
   The slides themselves are not published here; each recap says what the deck covers, in our own words.

   Per lecture:
     deck/slides  the PDF in the course folder and its page count (null = no deck in the folder yet)
     q            the big question the deck opens with
     sum          one-paragraph summary
     ideas        key ideas, in the order the slides take them
     eq           key equations [label, TeX]
     nums         numbers worth remembering [what, value]
     think        discussion prompts from class: try, then reveal
     quiz         multiple choice (same shape as the chapter questions; `ch` = lesson it reviews, `s` = section)
     links        links shown on the slides or used in class
     sky          what the class telescope (a Seestar S30 Pro) imaged that week, as shown on the opening slides */
window.LECTURES = {
  L1: {
    deck: "Astro1_L1.pdf", slides: 31,
    q: "Where are we going this term?",
    sum: "The opening lecture: who runs the course, how it works (a required Friday section, site visits around the University, the Science Center rooftop observatory) and the map of the term. The second half zooms out through the size scales of the universe, from Earth to the cosmic web.",
    ideas: [
      "Four stops on the term's road map: <b>Introduction</b> (how we see and measure the sky) → <b>Planets</b> → <b>Stars</b> → <b>Galaxies & Cosmology</b>.",
      "Each module zooms out by orders of magnitude: planets, stars, galaxies, galaxy clusters, and finally the <b>cosmic web</b> of filaments and voids.",
      "Astronomy here is hands-on: sections visit collections (historical instruments, glass plates, meteorites) and the rooftop telescopes, including solar observing.",
      "The language of the course is <b>powers of ten</b>: homework asks for scientific notation and two significant digits throughout.",
    ],
    eq: [["Scientific notation", "1.5\\times10^{13}\\,\\text{cm} = 1\\ \\text{AU}"], ["Light-travel distance", "d = c\\,t"]],
    nums: [["Earth–Sun distance", "1 AU = 1.5 × 10¹³ cm (8.3 light-minutes)"], ["Parsec", "1 pc = 3.09 × 10¹⁸ cm = 3.26 ly"], ["Milky Way disk", "~30 kpc across, 100+ billion stars"], ["Andromeda (M31)", "~0.77 Mpc = 2.5 million ly"], ["Cosmic web", "filaments and voids tens of Mpc across"]],
    think: [
      { q: "Rank by size: a galaxy cluster, the Solar System, the Milky Way, the cosmic web, a star.", a: "Star (~10¹¹ cm) → Solar System (~100 AU) → Milky Way (~30 kpc) → galaxy cluster (a few Mpc) → cosmic web (filaments of tens of Mpc). Each step is a factor of 10³–10⁸." },
    ],
    quiz: [
      { q: "Which list runs from smallest to largest?", o: ["Solar System, Milky Way, galaxy cluster, cosmic web", "Milky Way, Solar System, cosmic web, galaxy cluster", "Solar System, galaxy cluster, Milky Way, cosmic web", "Galaxy cluster, Milky Way, Solar System, cosmic web"], a: 0, e: "Planets orbit within ~100 AU; the Milky Way is ~30 kpc across; clusters hold hundreds to thousands of galaxies over a few Mpc; the cosmic web strings clusters along filaments.", ch: "ch01", s: "1.1" },
      { q: "Sunlight left the Sun about how long before it reaches your eye?", o: ["8 seconds", "8 minutes", "8 hours", "8 days"], a: 1, e: "1 AU / c = 1.5 × 10¹³ cm / 3 × 10¹⁰ cm/s ≈ 500 s ≈ 8.3 minutes. Looking out is looking back in time.", ch: "ch01", s: "1.1" },
    ],
    links: [],
  },

  L2: {
    deck: "Astro1_L2.pdf", slides: 17,
    q: "What does the Universe look like?",
    sum: "Course objectives, grading and the AI policy, then a tour of what the sky actually shows us: a sunset, the night sky over a house, Orion, the Milky Way, Andromeda, the Trifid Nebula. The catch: the sky gives us directions and angles, not distances. The lecture ends with a quiz on angular size.",
    ideas: [
      "Three course objectives: what are the <b>big questions</b> astronomy asks, what is the universe <b>made of</b> and which processes govern it, and which <b>techniques</b> let us answer them.",
      "Grading: homework 20%, lecture & section participation 30%, reading 15%, midterm 15%, final 20%.",
      "Everything in a picture of the sky is an <b>angle</b>. The small-angle formula links angular size, true size and distance: \\(\\theta = s/d\\) with θ in radians.",
      "The same angle can hide wildly different objects: a galaxy a few arcseconds across in a JWST deep field, the Ring Nebula about an arcminute, the nebulae of Orion spanning degrees.",
      "Size or distance alone can't be read off an image. You need one to get the other, which is why the rest of the course spends so much effort on distances.",
    ],
    eq: [["Small-angle formula", "\\theta\\,[\\text{rad}] = \\dfrac{s}{d}"], ["Angle units", "1\\ \\text{rad} = 57.3^\\circ = 206{,}265''"], ["", "1^\\circ = 60' ,\\quad 1' = 60''"]],
    nums: [["1 arcsecond", "4.85 × 10⁻⁶ rad"], ["1 arcminute", "2.9 × 10⁻⁴ rad"], ["Full Moon", "~0.5° across"], ["Grading", "HW 20 · participation 30 · reading 15 · midterm 15 · final 20"]],
    think: [
      { q: "Two nebulae look equally big on the sky. One is twice as far away. How do their real sizes compare?", a: "s = θ d, so at the same θ the farther one is twice as large." },
    ],
    quiz: [
      { q: "A JWST image is 1 arcminute wide. The galaxies in it are a few arcseconds across. Their size/distance is about…", o: ["1 × 10⁻⁵", "3 × 10⁻⁴", "1 × 10⁻²", "0.3"], a: 0, e: "A few arcseconds × 4.85 × 10⁻⁶ rad/arcsec ≈ 10⁻⁵. (Slide quiz from L2.)", ch: "ch01", s: "1.1" },
      { q: "An image of the Ring Nebula is 2 arcminutes wide and the nebula fills about half of it. Its size/distance is about…", o: ["2 × 10⁻⁷", "3 × 10⁻⁴", "2 × 10⁻²", "0.5"], a: 1, e: "About 1 arcminute = 1/60 × 1/57.3 rad ≈ 2.9 × 10⁻⁴. (Slide quiz from L2.)", ch: "ch01", s: "1.1" },
      { q: "A wide-angle photo of Orion is 60° across; its big glowing nebulae span several degrees. Their size/distance is about…", o: ["2 × 10⁻⁷", "3 × 10⁻⁴", "0.1", "3"], a: 2, e: "6° / 57.3° per radian ≈ 0.1. (Slide quiz from L2.)", ch: "ch01", s: "1.1" },
    ],
    links: [],
  },

  L3: { deck: null },
  L4: { deck: null },

  L5: {
    deck: "Astro1_L5.pdf", slides: 10,
    q: "What is light, and what can it tell us?",
    sum: "Light as an electromagnetic wave and as photons, the electromagnetic spectrum, the energy levels of hydrogen, the Maxwell distribution of particle speeds, and thermal (blackbody) radiation. The deck opens with the class telescope's image of the galaxy NGC 7331.",
    ideas: [
      "Light is an <b>electromagnetic wave</b>: electric and magnetic fields oscillating at right angles to each other and to the direction of travel, moving at c.",
      "Light also comes in <b>photons</b>, discrete chunks (or wave packets) with energy \\(E = hf = hc/\\lambda\\).",
      "The <b>spectrum</b> runs from radio to gamma rays. Only visible light, radio and a few infrared windows get through the atmosphere, which is why X-ray and gamma-ray telescopes fly in space.",
      "Atoms have <b>discrete energy levels</b>. An electron jumping between levels emits or absorbs a photon of exactly the energy difference. Hydrogen's series: Lyman (down to n = 1, ultraviolet), <b>Balmer</b> (to n = 2, visible: Hα at 656 nm), Paschen, Brackett, Pfund (infrared).",
      "Temperature is random motion: the <b>Maxwell distribution</b> of speeds shifts to faster, broader speeds as gas gets hotter.",
      "<b>Thermal radiation:</b> a hotter object emits more at <i>every</i> wavelength (total ∝ T⁴) and peaks at shorter wavelength (Wien's law). Curves for 3500–5500 K show both effects.",
    ],
    eq: [["Wave relation", "c = \\lambda f"], ["Photon energy", "E = hf = \\dfrac{hc}{\\lambda}"], ["Hydrogen levels", "E_n = -\\dfrac{13.6\\ \\text{eV}}{n^2}"], ["Wien's law", "\\lambda_{\\text{peak}} \\approx \\dfrac{2.9\\times10^{6}\\ \\text{nm K}}{T}"], ["Stefan–Boltzmann", "F = \\sigma T^4"]],
    nums: [["Hα (n = 3 → 2)", "656.3 nm, red"], ["Handy shortcut", "hc ≈ 1240 eV·nm"], ["1 eV", "1.6 × 10⁻¹² erg"], ["Sun", "T ≈ 5800 K, peak ≈ 500 nm"]],
    think: [
      { q: "Why does a hot, thin gas cloud give bright emission lines, while a hot, dense object gives a smooth continuous spectrum?", a: "In a thin gas each atom radiates on its own, only at the energy differences of its levels. In a dense object particles collide constantly and the light is reprocessed many times, so it comes out as thermal radiation at all wavelengths, shaped only by temperature." },
    ],
    quiz: [
      { q: "Which hydrogen transition makes the red Hα line at 656 nm?", o: ["n = 2 → 1", "n = 3 → 2", "n = 4 → 3", "n = ∞ → 1"], a: 1, e: "Balmer lines end on n = 2. ΔE = 13.6 (1/4 − 1/9) eV = 1.89 eV → λ = 1240/1.89 ≈ 656 nm.", ch: "ch05", s: "5.2" },
      { q: "Two blackbodies of the same size are at 5500 K and 3500 K. The hotter one…", o: ["emits more at every wavelength and peaks bluer", "peaks at a redder wavelength and emits less overall", "emits more only at the blue end of the spectrum", "emits the same total power, just at bluer wavelengths"], a: 0, e: "Hotter means brighter everywhere (∝ T⁴ in total) and a peak at shorter λ (Wien). The L5 thermal-radiation plot shows the curves never cross.", ch: "ch05", s: "5.1" },
      { q: "With hc ≈ 1240 eV·nm, a 5 eV photon has a wavelength of about…", o: ["250 nm (ultraviolet)", "620 nm (visible)", "1240 nm (infrared)", "6200 nm (infrared)"], a: 0, e: "λ = 1240/5 ≈ 248 nm, in the ultraviolet. Same method as HW 3 “Atoms From Afar”.", ch: "ch05", s: "5.1" },
    ],
    links: [],
    sky: "Classmates' 2-minute shot of the spiral galaxy NGC 7331, the galaxy analysed again in L7.",
  },

  L6: {
    deck: "Astro1_L6.pdf", slides: 30,
    q: "How can we measure the sky?",
    sum: "From eyes to telescopes to cameras, then how astronomers quantify brightness. Eyes and lenses bend light; telescopes win by collecting area; resolution is set by diffraction and, from the ground, by the atmosphere. CCD/CMOS sensors count photons behind colour filters. The magnitude system turns fluxes into numbers, and sky brightness decides what you can see from Cambridge.",
    ideas: [
      "<b>Eyes:</b> a lens bends light because light travels slower in glass or tissue than in vacuum (the eye's lens has a refractive index of about 1.4). Owls have huge tubular eyes for night vision; a giant squid's eye is basketball-sized. The retina senses light with rods and cones.",
      "<b>Telescopes</b> come as refractors (lenses) or reflectors (mirrors). Total light collected = flux × collecting area, and area grows as the diameter squared.",
      "Three separate things: <b>magnification</b> comes from focal length (plus an eyepiece), <b>resolving power</b> from diameter, <b>brightness</b> from area.",
      "<b>Diffraction limit:</b> θ ≈ λ/D, roughly 1″ for a 4-inch telescope in visible light. From the ground, <b>atmospheric turbulence</b> (seeing) blurs stars to ~1″, so a bigger mirror mainly buys light, not sharpness.",
      "<b>CCD/CMOS cameras:</b> each pixel is a photodiode that collects charge in a potential well; colour comes from red, green and blue filters over the pixels, each with its own wavelength response.",
      "<b>Magnitudes:</b> logarithmic and backwards (bigger = fainter). 5 magnitudes = factor 100 in flux. Absolute magnitude M is the apparent magnitude a star would have at 10 pc; the Sun's is +4.8. Colour = difference of magnitudes in two filters.",
      "<b>Sky brightness</b> is measured in mag/arcsec². The Bortle scale runs from class 1 (pristine, naked-eye limit ~7.6–8) to class 8–9 (inner city, < 4.5). Only the bright core of the Orion Nebula beats Cambridge's sky.",
    ],
    eq: [["Collecting area", "A = \\pi \\left(\\tfrac{D}{2}\\right)^2"], ["Diffraction limit", "\\theta \\approx \\dfrac{\\lambda}{D}\\ \\text{(rad)}"], ["Magnitudes", "m_2 - m_1 = -2.5\\log_{10}\\dfrac{F_2}{F_1}"], ["Distance modulus", "m - M = 5\\log_{10}\\dfrac{d}{10\\ \\text{pc}}"], ["Calibrated to the Sun", "m = 4.8 - 2.5\\log_{10}\\dfrac{L}{L_\\odot} + 5\\log_{10}\\dfrac{d}{10\\ \\text{pc}}"]],
    nums: [["Sun / full Moon / Venus", "m = −26.7 / −12.5 / −4.4"], ["Sirius / Vega / Polaris", "m = −1.5 / 0 / 2.5"], ["Naked eye / binoculars", "limit ≈ 6 / ≈ 10"], ["1-m telescope / Hubble", "limit ≈ 18 / ≈ 27+"], ["Dark site vs city sky", "> 21.9 vs < 18 mag/arcsec²"], ["Milky Way / daytime sky", "~20 / ~2 mag/arcsec²"]],
    think: [
      { q: "Cambridge is a Bortle 8–9 sky. Why can you still see Jupiter easily but not the Milky Way?", a: "Jupiter is a point-like source: all its light lands in one spot, far brighter than the sky behind it. The Milky Way is spread out; its surface brightness (~20 mag/arcsec²) is fainter than the city sky glow (~18 mag/arcsec²), so it drowns." },
      { q: "Why do owls see so well at night but can't focus on nearby objects?", a: "Large pupils collect lots of light and a long focal length gives a bright, large image, but their tubular eyes can't change shape (or rotate) much, so they're fixed for distant focus." },
    ],
    quiz: [
      { q: "You trade a 4-inch telescope for an 8-inch one. How much more light does it collect?", o: ["2 times", "4 times", "8 times", "16 times"], a: 1, e: "Light ∝ area ∝ D². Doubling D gives 2² = 4 times the light.", ch: "ch05", s: "5.3" },
      { q: "Star B is 5 magnitudes fainter than star A. The flux from B is…", o: ["5 times smaller", "25 times smaller", "100 times smaller", "−2.5 times smaller"], a: 2, e: "5 magnitudes = factor 100 by definition: 10^(5/2.5) = 100.", ch: "ch12", s: "12.1" },
      { q: "Why don't big ground-based telescopes see much sharper than ~1″ without adaptive optics?", o: ["Atmospheric turbulence blurs the image", "Their mirrors are too small", "Diffraction gets worse for big mirrors", "Cameras have too few pixels"], a: 0, e: "Seeing from the turbulent atmosphere is ~1″, far worse than a big mirror's diffraction limit.", ch: "ch05", s: "5.3" },
      { q: "A star of apparent magnitude 10 is 100 pc away. Its absolute magnitude is…", o: ["0", "5", "10", "15"], a: 1, e: "m − M = 5 log₁₀(100/10) = 5, so M = 10 − 5 = 5.", ch: "ch12", s: "12.1" },
    ],
    links: [
      { t: "Light pollution map", u: "https://www.lightpollutionmap.app/", d: "Sky brightness where you are (shown in L6)" },
    ],
  },

  L7: {
    deck: "Astro1_L7.pdf", slides: 23,
    q: "How can we measure the sky? Working with astronomical data.",
    sum: "A hands-on lecture. It opens with the class telescope's images from Cambridge on Sep 23 (Moon, Andromeda, NGC 7331, the Pacman Nebula NGC 281, Polaris), reviews cameras, magnitudes and sky brightness, then turns into an image-analysis exercise: measure the supernova in NGC 7331 with AstroImageJ.",
    ideas: [
      "A digital image is a grid of <b>counts</b> per pixel, stored as a FITS file. Our telescope stacks many short exposures (e.g. 6 × 10 s) to beat the noise.",
      "<b>Plate solving</b> (astrometry.net) matches the star pattern to a catalog and writes a <b>WCS</b> into the header: every pixel gets a right ascension and declination.",
      "<b>Aperture photometry:</b> add up the counts in a circle around the star and subtract the sky measured in a ring around it.",
      "<b>Differential photometry:</b> compare with a nearby star of known magnitude, so clouds and the camera's response cancel: \\(m_\\star = m_{\\text{comp}} - 2.5\\log_{10}(F_\\star/F_{\\text{comp}})\\).",
      "The <b>limiting magnitude</b> is the faintest star you can still detect in the image; it tells you what the data can and can't show.",
      "AAVSO's light-curve tools give other observers' magnitudes for the same supernova. With the galaxy's distance, the <b>distance modulus</b> turns apparent into absolute magnitude, and that tells you what kind of explosion it was.",
    ],
    eq: [["Differential photometry", "m_\\star = m_{\\text{comp}} - 2.5\\log_{10}\\dfrac{F_\\star}{F_{\\text{comp}}}"], ["Absolute magnitude", "M = m - 5\\log_{10}\\dfrac{d}{10\\ \\text{pc}}"]],
    nums: [["Type Ia supernova at peak", "M ≈ −19.3"], ["Distance modulus at 10 Mpc", "m − M = 30"], ["Our telescope", "Seestar S30 Pro, stacked 10-s frames"]],
    think: [
      { q: "Why compare the supernova with stars in the same image instead of using the raw counts?", a: "Thin cloud, airmass, exposure time and the camera's sensitivity change the counts of every star by the same factor. A ratio to a known star cancels all of that." },
    ],
    quiz: [
      { q: "A comparison star (m = 12.0) gives 4000 counts; the supernova gives 1000 counts. The supernova's magnitude is…", o: ["10.5", "12.25", "13.5", "16.0"], a: 2, e: "The supernova is 4 times fainter: Δm = 2.5 log₁₀ 4 = 1.5, so m = 12.0 + 1.5 = 13.5.", ch: "ch12", s: "12.1" },
      { q: "What does plate-solving your image on astrometry.net add to the FITS file?", o: ["A WCS mapping each pixel to sky coordinates", "Calibrated magnitudes for every star", "A colour version of the image", "A noise-free stacked image"], a: 0, e: "The solver identifies the star pattern and writes the world coordinate system (RA/Dec per pixel) into the header.", ch: "ch05", s: "5.3" },
      { q: "If NGC 7331 is 14 Mpc away, a supernova there at m = 12 has an absolute magnitude of about…", o: ["−18.7", "−12", "+12", "+42.7"], a: 0, e: "m − M = 5 log₁₀(1.4 × 10⁷ pc / 10 pc) ≈ 30.7, so M ≈ 12 − 30.7 ≈ −18.7: as bright as billions of Suns.", ch: "ch16", s: "16.2" },
    ],
    links: [
      { t: "AstroImageJ", u: "https://astroimagej.com/", d: "Free photometry software used in class" },
      { t: "astrometry.net", u: "https://nova.astrometry.net/", d: "Plate-solve your image" },
      { t: "AAVSO Light Curve Generator", u: "https://www.aavso.org/LCGv2/", d: "Other observers' magnitudes" },
    ],
    lab: ["pipeline"],
    sky: "Cambridge, Sep 23: the Moon, Andromeda (M31), NGC 7331, the Pacman Nebula (NGC 281) and Polaris.",
  },

  L8: {
    deck: "Astro1_L8.pdf", slides: 20,
    q: "How do planets like Earth form?",
    sum: "From a historical orrery to the Orion Nebula, the nearest big star-forming region, seen by Hubble and JWST. The nebular hypothesis: a spinning cloud collapses, spins up and flattens into a disk where planets grow. Energy and angular momentum conservation explain why. ALMA's image of HL Tau shows the rings and gaps young planets carve.",
    ideas: [
      "The <b>Orion Nebula (M42)</b>, ~1500 light-years away, is a stellar nursery: the hot young Trapezium stars have blown a cavity open toward us. JWST's near-infrared images (false colour) see through the dust to the newborn stars.",
      "<b>Nebular hypothesis:</b> gravity pulls a cloud in against gas pressure; as it shrinks it spins faster (angular momentum conservation) and flattens into a rotating pancake.",
      "Inside the disk, local regions collapse further: <b>protoplanets</b> grow while the protosun forms at the center.",
      "Why it works: <b>energy</b> changes form (gravitational → kinetic → thermal → radiation, so the cloud heats and glows) while <b>angular momentum</b> stays with the gas, so it can't fall straight in.",
      "Simulations show a planet carving a gap and spiral wakes in its disk; <b>ALMA's HL Tau</b> image at mm wavelengths shows exactly such concentric rings and gaps.",
      "The full sequence: cloud core collapse → protostar with infalling envelope (Class 0/I) → disk of gas (99%) and dust (1%) → dust settles and drifts; solids condense at the <b>snow line</b> → planetesimals → gas giants form beyond the snow line → instabilities reshuffle the system.",
      "A thermal (FLIR) camera shows everything glows in the infrared according to its temperature: the same physics sets planet temperatures.",
    ],
    eq: [["Angular momentum", "L = m\\,v\\,r = \\text{const.}\\ \\Rightarrow\\ r\\downarrow\\ \\text{means}\\ v\\uparrow"], ["Energy budget", "\\Delta E_{\\text{grav}} \\to E_{\\text{thermal}} \\to \\text{radiation}"]],
    nums: [["Orion Nebula", "~1500 ly (~410 pc)"], ["Disk mass budget", "~99% gas, ~1% dust"], ["Frost line in the young Solar System", "~4 AU, between Mars and Jupiter"]],
    think: [
      { q: "A thermal camera shows a mug of hot water glowing bright in the infrared. What does that have to do with planets?", a: "Everything radiates according to its temperature. A planet's temperature is set by the balance between sunlight absorbed and infrared emitted, which is exactly HW 5 “Hot Potato?”." },
    ],
    quiz: [
      { q: "Why does a collapsing, slowly rotating cloud end up as a flat disk?", o: ["It spins up as it shrinks; collisions cancel vertical motion", "Magnetic fields squeeze the cloud into a thin sheet", "Radiation from the protostar pushes gas into one plane", "Gravity is always stronger along a cloud's equator"], a: 0, e: "Angular momentum conservation spins it up; gas can fall along the spin axis but not inward in the plane, and colliding gas averages out vertical motion.", ch: "ch06", s: "6.2–6.3" },
      { q: "Where does the energy that heats a collapsing cloud come from?", o: ["Gravitational energy released as gas falls inward", "Nuclear fusion starting throughout the gas", "Starlight absorbed from nearby massive stars", "Friction between the gas and magnetic fields"], a: 0, e: "Infall converts gravitational energy to kinetic and then thermal energy, which the cloud radiates away.", ch: "ch06", s: "6.2–6.3" },
      { q: "The dark rings in ALMA's image of the young disk around HL Tau are best explained by…", o: ["Young planets clearing paths in the dust", "Shadows of the central star's magnetic field", "Gaps where the gas has frozen", "Gaps carved by comets"], a: 0, e: "Simulations of a disk with an embedded planet produce the same gaps and rings.", ch: "ch06", s: "6.2–6.3" },
    ],
    links: [],
  },

  L9: {
    deck: "Astro1_L9.pdf", slides: 32,
    q: "Jupiter: a story of clouds and rotation. Saturn: rotation, rings and moons.",
    sum: "Jupiter spins once every 10 hours, so fast that it bulges at the equator and its weather is pulled into stripes. The lecture builds the two ‘fictitious’ forces of a rotating planet (centrifugal and Coriolis), then turns to Saturn: an even faster, flatter spinner with thin, young rings sculpted by its moons.",
    ideas: [
      "<b>Jupiter is oblate:</b> its equator is ~7% wider than its poles. The shape is set by the balance of centrifugal acceleration Ω²R against gravity GM/R², with Ω = 2π/P_rot.",
      "Jupiter's rotation period is just <b>10 hours</b>; it got its fast spin from the gas it accreted as it formed.",
      "Cloud layers stack by temperature: ammonia ice on top, ammonium hydrosulfide below, water ice deepest. Warm gas rises in bright <b>zones</b>, cooler gas sinks in dark <b>belts</b>.",
      "The <b>Coriolis acceleration</b> \\(\\vec a = -2\\vec\\Omega\\times\\vec v\\) turns any north–south or in–out flow sideways, stretching the weather into east–west bands. Cassini watched 24 rotations (~240 hours) of these jets in 2000.",
      "Moon count: Jupiter 95 (4 big Galilean moons), Saturn 274 (Titan big, many medium). Giant-planet moons are rock + <b>ice</b> because they formed beyond the frost line.",
      "Saturn spins in 10.5 hours and is even more oblate (~10%). Huygens explained its ‘ears’ as a ring in 1659; the rings went edge-on to Earth in March 2025.",
      "<b>Ring stats:</b> huge (~200,000 km across), extremely thin (tens of meters), and young (roughly 1–400 Myr). <b>Gaps</b> come from moons: the Cassini Division sits at a 2:1 resonance with Mimas; the moonlet Pan clears the Encke gap.",
      "Bonus: <b>tidally heated moons</b>. Io's volcanoes and Enceladus's geysers are powered by tidal flexing, not by sunlight.",
    ],
    eq: [["Gravity at the surface", "a_{\\text{grav}} = \\dfrac{G M_p}{R_p^2}"], ["Centrifugal", "a_{\\text{cf}} = \\Omega^2 R_p,\\quad \\Omega = \\dfrac{2\\pi}{P_{\\text{rot}}}"], ["Coriolis", "\\vec a_{\\text{cor}} = -2\\,\\vec\\Omega \\times \\vec v"]],
    nums: [["Jupiter rotation", "10 h; equator ~7% wider"], ["Saturn rotation", "10.5 h; ~10% oblate"], ["Moons", "Jupiter 95, Saturn 274"], ["Saturn's rings", "~200,000 km across, ~10 m thick, 1–400 Myr old"]],
    think: [
      { q: "Estimate a_cf / a_grav at Jupiter's equator (P = 10 h, M = 1.9 × 10³⁰ g, R = 7.15 × 10⁹ cm). Is a 7% bulge plausible?", a: "Ω = 2π/36,000 s ≈ 1.7 × 10⁻⁴ s⁻¹, so Ω²R ≈ 220 cm/s². GM/R² ≈ 2500 cm/s². The ratio is ~9%: spin counters gravity by about that much at the equator, consistent with a bulge of several percent." },
      { q: "Io and Enceladus are small, so they should have cooled long ago. Why are they active?", a: "Orbital resonances keep their orbits slightly elliptical, so the planet's tidal pull flexes them every orbit. Friction from that flexing heats their interiors." },
    ],
    quiz: [
      { q: "Why is Jupiter's equator about 7% wider than its poles?", o: ["Its fast 10-hour spin flings the equator outward", "The tidal pull of its big moons stretches the equator", "Sunlight heats the equator so the gas there expands", "Its heavy core sits off-center, pulling one side out"], a: 0, e: "Fast rotation: Ω²R is ~9% of GM/R² at Jupiter's equator.", ch: "ch08", s: "8.1" },
      { q: "What does the Coriolis effect do to winds on a fast-spinning planet?", o: ["Turns flows sideways into east–west bands", "Speeds every wind up as it heads for the poles", "Stops all winds near the equator completely", "Pushes the gas inward toward the planet's core"], a: 0, e: "a = −2Ω × v is perpendicular to the velocity, so flows get deflected sideways into zonal jets.", ch: "ch08", s: "8.1" },
      { q: "Why is there a gap (the Cassini Division) in Saturn's rings?", o: ["Repeated tugs from Mimas (a 2:1 resonance) clear it", "Ring particles there melted and evaporated long ago", "A large moon orbits inside the gap and sweeps it", "The Sun's tides pull the particles out of that zone"], a: 0, e: "Resonant kicks add up orbit after orbit. Small moonlets like Pan clear narrower gaps such as the Encke gap.", ch: "ch08", s: "8.3" },
    ],
    links: [],
  },

  L10: {
    deck: "Astro1_L10.pdf", slides: 3,
    q: "How do we find planets we can't see?",
    sum: "A short deck: the class telescope's 10-minute image of the Veil Nebula (NGC 6992), and the Doppler effect: a source moving toward you squeezes its waves, one moving away stretches them. In class, the Colab orbit notebook stepped a planet around its star with Newton's gravity, the basis of HW 4.",
    ideas: [
      "<b>Doppler effect:</b> motion toward the observer shortens the wavelength (blueshift), motion away lengthens it (redshift). For light, \\(\\Delta\\lambda/\\lambda_0 = v_r/c\\).",
      "Star and planet both orbit their <b>center of mass</b>; the star's wobble shows up as a periodic shift of its spectral lines (the radial-velocity method).",
      "Momentum balance links the two: \\(M_\\star v_\\star = M_p v_p\\). A bigger, closer planet makes a bigger wobble.",
      "Doppler measures only the line-of-sight part of the motion, so it gives a <b>minimum mass</b> (M sin i).",
      "<b>Orbits in code:</b> compute the gravitational acceleration, update the velocity, update the position, repeat. You need well over 100 steps per orbit, or the orbit drifts.",
      "51 Pegasi b (1995) was the first planet found around a Sun-like star: a ‘hot Jupiter’ with a 4.2-day orbit.",
    ],
    eq: [["Doppler shift", "\\dfrac{\\Delta\\lambda}{\\lambda_0} = \\dfrac{v_r}{c}"], ["Center of mass", "M_\\star v_\\star = M_p v_p"], ["Newton's Kepler 3", "P^2 = \\dfrac{4\\pi^2 a^3}{G M}"], ["One time step", "\\vec a = -\\dfrac{GM\\vec r}{r^3},\\ \\vec v \\mathrel{+}= \\vec a\\,\\Delta t,\\ \\vec r \\mathrel{+}= \\vec v\\,\\Delta t"]],
    nums: [["51 Peg b", "P = 4.23 d, a ≈ 0.05 AU"], ["Sun's wobble from Jupiter", "≈ 13 m/s"], ["Sun's wobble from Earth", "≈ 0.09 m/s"]],
    think: [
      { q: "In the orbit notebook, what happens if you make the time step too large?", a: "The planet moves in straight-line chunks that overshoot the curve; energy isn't conserved, and the orbit spirals out (or in) instead of closing on itself." },
    ],
    quiz: [
      { q: "A line with rest wavelength 500.0000 nm is observed at 500.0001 nm. The star is moving…", o: ["away at about 60 m/s", "toward us at about 60 m/s", "away at about 6 km/s", "away at about 0.6 m/s"], a: 0, e: "Δλ/λ = 2 × 10⁻⁷; v = 2 × 10⁻⁷ × 3 × 10⁸ m/s = 60 m/s. Longer wavelength means moving away (redshift).", ch: "ch05", s: "5.2" },
      { q: "Why does the Doppler method give only a minimum planet mass?", o: ["Only the line-of-sight motion shows; the tilt is unknown", "The planet itself is far too faint to be measured", "Spectral lines blur, so only a lower limit is safe", "The orbital period can never be measured exactly"], a: 0, e: "We measure v sin i. Only if the planet also transits (edge-on orbit) do we know i.", ch: "ch10", s: "10.1" },
      { q: "51 Peg b orbits its star in 4.2 days. Compared with Mercury's orbit (88 days), it is…", o: ["much closer to its star, about 0.05 AU", "about as far as Mercury", "farther out, near 1 AU", "impossible to place without its mass"], a: 0, e: "Kepler 3: a ∝ P^(2/3) for a Sun-like star, giving ≈ 0.05 AU, a ‘hot Jupiter’.", ch: "ch10", s: "10.2" },
    ],
    links: [
      { t: "51 Pegasi b (Wikipedia)", u: "https://en.wikipedia.org/wiki/51_Pegasi_b", d: "Check your HW 4 numbers" },
    ],
    lab: ["data"],
    sky: "The Veil Nebula (NGC 6992), a supernova remnant, in a 10-minute exposure.",
  },

  L11: { deck: null },

  L12: {
    deck: "Astro1_L12.pdf", slides: 16,
    q: "What are the stars?",
    sum: "Stellar spectra, class by class: O, B, A, F, G, K, M, with the features that mark each one and the temperatures behind them. Why line strengths peak at particular temperatures, where the classification came from (The Glass Universe), and the Hertzsprung–Russell diagram that organises it all.",
    ideas: [
      "The spectral sequence is a <b>temperature</b> sequence: O ~40,000 K, B ~20,000 K, A ~10,000 K, F ~7,500 K, G ~6,000 K, K ~4,500 K, M ~3,500 K.",
      "Each class has a fingerprint: helium lines in O and B stars; the strongest <b>hydrogen</b> (Balmer) lines in A stars; calcium, sodium and iron lines growing through F, G, K; broad <b>titanium oxide</b> molecular bands in M stars.",
      "Line strength depends on temperature, not just composition: hydrogen lines peak near ~10,000 K, where many electrons sit in level n = 2. Hotter, hydrogen is ionized; cooler, electrons stay in n = 1.",
      "The classification came out of the Harvard College Observatory's plate collection and its women ‘computers’ (Cannon, Leavitt, Payne and others): the subject of Dava Sobel's <i>The Glass Universe</i>, read for section.",
      "The <b>H–R diagram</b> plots luminosity against temperature: most stars lie on the <b>main sequence</b>; giants and supergiants are big and luminous; white dwarfs small and dim. Radius follows from L = 4πR²σT⁴.",
    ],
    eq: [["Luminosity", "L = 4\\pi R^2 \\sigma T^4"], ["Radius from L and T", "\\dfrac{R}{R_\\odot} = \\left(\\dfrac{L}{L_\\odot}\\right)^{1/2}\\left(\\dfrac{T_\\odot}{T}\\right)^{2}"]],
    nums: [["O / A / G / M", "~40,000 / 10,000 / 6,000 / 3,500 K"], ["Sun", "G2 V, 5800 K"], ["Mnemonic", "Oh Be A Fine Girl/Guy, Kiss Me"]],
    think: [
      { q: "A spectrum shows strong ionized calcium and many metal lines but weak hydrogen lines. Hotter or cooler than the Sun?", a: "Cooler: a K star. Metal lines strengthen as stars cool through G and K, while the Balmer lines fade because few electrons are excited to n = 2." },
    ],
    quiz: [
      { q: "Why are hydrogen Balmer lines weak in the hottest O stars?", o: ["Their hydrogen is mostly ionized, so it can't absorb", "O stars have used up almost all of their hydrogen", "Their light is too blue for the lines to show up", "Balmer lines only form in cool planetary atmospheres"], a: 0, e: "Balmer absorption needs electrons in n = 2. At ~40,000 K hydrogen is mostly ionized.", ch: "ch12", s: "12.1" },
      { q: "Which spectral class shows broad titanium oxide (TiO) bands?", o: ["M", "A", "B", "O"], a: 0, e: "Molecules survive only in the coolest atmospheres (~3500 K).", ch: "ch12", s: "12.1" },
      { q: "Two stars have the same temperature; one is 100 times more luminous. Its radius is…", o: ["10 times larger", "100 times larger", "10,000 times larger", "the same"], a: 0, e: "L ∝ R² at fixed T, so R ∝ √L = √100 = 10.", ch: "ch12", s: "12.2" },
    ],
    links: [],
  },

  L13: {
    deck: "Astro1_L13,14.pdf", slides: 28,
    q: "How do stars work? (structure)",
    sum: "The first half of the combined L13–14 deck: the Sun as the nearest star. Its layered interior, the boiling convective surface (granulation), sunspots, prominences and coronal mass ejections, and the aurora they trigger on Earth.",
    ideas: [
      "The Sun's layers: <b>core</b> (fusion), <b>radiative zone</b> (energy diffuses out as photons), <b>convection zone</b> (hot gas rises, cool gas sinks), the visible <b>photosphere</b>, then chromosphere and corona.",
      "<b>Granulation:</b> the photosphere is covered in convective cells about 1000 km across: bright centers where hot gas rises, dark edges where cooler gas sinks. They change within minutes.",
      "<b>Sunspots</b> are cooler patches (~4000 K vs ~5800 K) where strong magnetic fields block convection.",
      "Magnetic activity launches <b>prominences</b> and <b>coronal mass ejections</b>; when they hit Earth's magnetic field, charged particles stream into the upper atmosphere and make <b>aurora</b>.",
      "Holding it together: <b>hydrostatic equilibrium</b>. At every depth, pressure pushing out balances the weight of the layers above.",
    ],
    eq: [["Hydrostatic equilibrium", "\\dfrac{dP}{dr} = -\\dfrac{G M(r)\\,\\rho}{r^2}"]],
    nums: [["Sun's radius", "696,000 km"], ["Granule size", "~1000 km"], ["Photosphere / sunspot", "~5800 K / ~4000 K"], ["Core temperature", "~1.5 × 10⁷ K"]],
    think: [],
    quiz: [
      { q: "Solar granulation is…", o: ["the tops of convection cells, hot gas rising in each", "clouds of dark dust floating above the photosphere", "thousands of tiny sunspots seen at low resolution", "shadows cast by loops of gas in the hot corona"], a: 0, e: "The pattern is the top of the convection zone.", ch: "ch11", s: "11.1" },
      { q: "Sunspots look dark because they are…", o: ["cooler patches where magnetic fields block convection", "holes through which we see the Sun's cold core", "dense clouds of dust drifting over the surface", "regions where the gas has been blown away"], a: 0, e: "~4000 K instead of ~5800 K; magnetic fields suppress the convection that brings up heat.", ch: "ch11", s: "11.3" },
      { q: "Aurora on Earth are caused by…", o: ["solar particles funneled in by Earth's magnetic field", "sunlight reflected off the ice around the poles", "lightning storms high up in the stratosphere", "the Moon's tides acting on the upper atmosphere"], a: 0, e: "Solar wind and coronal mass ejections excite oxygen and nitrogen atoms, which then emit light.", ch: "ch11", s: "11.3" },
    ],
    links: [],
    sky: "Classmates' images: the galaxy NGC 2403 and the Pacman Nebula (NGC 281).",
  },

  L14: {
    deck: "Astro1_L13,14.pdf", slides: 28,
    q: "How do stars work? (nuclear burning and stellar thermostats)",
    sum: "The second half of the L13–14 deck: the proton–proton chain and the 26.7 MeV each helium nucleus releases; why the energy generation rate is such a steep function of temperature; the stellar thermostat that keeps stars stable; H–R diagrams from Hipparcos and Gaia; red giants; and white dwarfs held up by electron degeneracy.",
    ideas: [
      "<b>pp chain:</b> four protons become one helium-4 nucleus, mostly via PP I (~69% at the ³He step) and PP II; PP III is rare. Each completed chain releases <b>~26.7 MeV</b>, the 0.7% of mass that goes missing.",
      "Energy generation rate = reaction rate × energy per reaction. Rates are <b>steep functions of T</b>: the pp chain ~T⁴, the CNO cycle ~T¹⁶⁻²⁰, triple-alpha (helium burning) steeper still. The Sun sits on the pp side.",
      "<b>Stellar thermostat</b> (the three questions from class): squeeze a star and its core heats; hotter means much faster fusion; the extra energy pushes the core back out, it cools, fusion slows. That feedback keeps stars stable for billions of years.",
      "Because of the thermostat, the <b>core temperature is similar all along the main sequence</b>; heavier stars burn hotter and much faster.",
      "Gaia's H–R diagram, coloured by inferred mass: main sequence from ~0.14 to ~2.3 M☉, giants, unresolved binaries, and a separate white-dwarf sequence (~0.6 M☉).",
      "After the main sequence: hydrogen burns in a <b>shell</b> around an inert helium core and the star swells into a <b>red giant</b>; then helium ignites in the core (red clump), and finally the star sheds a planetary nebula.",
      "<b>White dwarfs</b> are held apart by electron degeneracy pressure. Strange but true: a 1.3 M☉ white dwarf is <i>smaller</i> than a 1.0 M☉ one, and both are about Earth-sized. Gaia even sees them crystallize as they cool.",
    ],
    eq: [["Net pp chain", "4\\,{}^1\\text{H} \\to {}^4\\text{He} + 2e^+ + 2\\nu_e + 26.7\\ \\text{MeV}"], ["Mass to energy", "E = \\Delta m\\,c^2 = 0.007\\,m\\,c^2"], ["Temperature sensitivity", "\\varepsilon_{pp} \\propto T^{4},\\quad \\varepsilon_{\\text{CNO}} \\propto T^{\\sim 18}"]],
    nums: [["Energy per He-4", "26.7 MeV (0.7% of the mass)"], ["Sun's core", "~1.5 × 10⁷ K"], ["Chandrasekhar limit", "1.4 M☉"], ["Typical white dwarf", "~0.6 M☉, Earth-sized"]],
    think: [
      { q: "If you squeezed a star, what would happen to its central pressure and temperature? Why?", a: "Both rise: compression does work on the gas (gravitational energy becomes heat), and a denser, hotter core has higher pressure." },
      { q: "If the central temperature goes up, what happens to the rest of the star?", a: "Fusion speeds up steeply, the extra energy raises the pressure, the core and the star expand, and expansion cools the core again." },
      { q: "So why are stars stable?", a: "Negative feedback: any squeeze heats the core and boosts fusion, which pushes back; any expansion cools it and slows fusion. Gravity and pressure stay balanced." },
    ],
    quiz: [
      { q: "What fraction of the mass of four hydrogen nuclei is turned into energy when they fuse into helium?", o: ["0.7%", "7%", "0.07%", "70%"], a: 0, e: "That's the 26.7 MeV per helium nucleus, and the number in HW 6 “How Long Will the Sun Shine?”.", ch: "ch11", s: "11.2" },
      { q: "Why is a 1.3 M☉ white dwarf smaller than a 1.0 M☉ one?", o: ["Degenerate electrons: more mass squeezes it smaller", "It is hotter, and hot white dwarfs shrink", "It burned more of its fuel, so less is left", "It rotates faster, which pulls it inward"], a: 0, e: "Degenerate matter behaves oddly: more mass, smaller radius, up to the 1.4 M☉ limit.", ch: "ch14", s: "14.1" },
      { q: "What powers a Sun-like star right after it leaves the main sequence?", o: ["Hydrogen fusion in a shell around the core", "Helium fusion in the core, right away", "Carbon fusion in a shell around the core", "Only gravitational contraction of the core"], a: 0, e: "The helium core contracts and heats until helium ignites later; meanwhile the shell makes the star a red giant.", ch: "ch13", s: "13.2" },
    ],
    links: [],
  },

  L15: {
    deck: "Astro1_L15.pdf", slides: 29,
    q: "Where do the elements come from? (massive stars and their deaths)",
    sum: "The CNO cycle and why massive stars burn so fast; the onion of burning shells late in a massive star's life; core collapse from the inside out; supernovae through history (the ‘guest star’ of 1054, Tycho's nova of 1572, SN 2011fe); and the open question of which stars explode and which collapse quietly into black holes, including the instructor's own research on a failed supernova in Andromeda.",
    ideas: [
      "Massive stars fuse hydrogen via the <b>CNO cycle</b>, carbon, nitrogen and oxygen acting as catalysts. Its steep T-dependence makes them burn fast and die young.",
      "Late in life the core becomes an <b>onion of shells</b> (H, He, C, Ne, O, Si) around an iron core. The core gets denser as shells appear, while the outside puffs up to a huge, low-density supergiant.",
      "Iron can't release energy by fusion, so the core collapses <b>inside out</b> on the free-fall time t ~ 1/√(Gρ): under a second for the iron core, ~hours for the helium core, months to years for the hydrogen envelope.",
      "The transient night sky has been recorded for centuries: the Song-dynasty ‘guest star’ of 1054 (today's Crab Nebula), Tycho Brahe's ‘stella nova’ of 1572, and modern surveys catching supernovae like SN 2011fe within hours.",
      "A successful explosion leaves a <b>neutron star</b>; a failed one leaves a <b>black hole</b>. Which stars do which has a very non-linear dependence on mass: honestly, we don't know.",
      "<b>Failed supernovae:</b> M31-2014-DS1, a luminous supergiant in Andromeda that brightened in the infrared (NEOWISE) and then disappeared (De, MacLeod et al. 2026). Fallback, partial ejection of the envelope and dust formation can hide the star as it becomes a black hole.",
    ],
    eq: [["Free-fall time", "t_{\\text{ff}} \\sim \\dfrac{1}{\\sqrt{G\\rho}}"]],
    nums: [["Iron core collapse", "< 1 s"], ["Crab supernova", "seen in 1054, 6500 ly away"], ["Tycho's supernova", "1572"]],
    think: [
      { q: "Check the free-fall times: ρ ≈ 10⁹ g/cm³ for the iron core, ρ ≈ 10⁻⁸ g/cm³ for a supergiant envelope.", a: "1/√(6.7 × 10⁻⁸ × 10⁹) ≈ 0.1 s; 1/√(6.7 × 10⁻⁸ × 10⁻⁸) ≈ 4 × 10⁷ s ≈ 1 year. The core is long gone before the envelope ‘notices’." },
    ],
    quiz: [
      { q: "Why does a massive star's iron core collapse?", o: ["Fusing iron releases no energy to hold it up", "Iron is radioactive and decays away quickly", "Its outer layers blow off and stop shielding it", "The core simply runs out of hydrogen to burn"], a: 0, e: "Iron has the most tightly bound nucleus; fusion beyond it costs energy.", ch: "ch13", s: "13.3" },
      { q: "How does collapse proceed through the star?", o: ["Inside out: core in < 1 s, envelope over months", "Outside in: the thin envelope falls first", "All layers fall together in the same instant", "Only the envelope collapses; the core stays put"], a: 0, e: "Free-fall time ∝ 1/√(Gρ), shortest where the density is highest.", ch: "ch13", s: "13.3" },
      { q: "What would a ‘failed supernova’ look like to a telescope?", o: ["A supergiant that flares in the infrared, then vanishes", "A supernova about twice as bright as a normal one", "A brand-new star appearing where none was before", "A star that turns blue and then keeps on shining"], a: 0, e: "That is what was seen for M31-2014-DS1 in Andromeda.", ch: "ch14", s: "14.3" },
    ],
    links: [],
  },

  L16: {
    deck: "Astro1_L16.pdf", slides: 27,
    q: "Where do the elements come from? (stellar remnants)",
    sum: "What's left behind: neutron stars (including magnetars and pulsars) and black holes, described by general relativity. Binary neutron stars like the Hulse–Taylor pulsar prove gravitational waves exist; LIGO's GW150914 heard two black holes merge. Neutron-star mergers fling out neutron-rich material where the heaviest elements form, completing the nucleosynthetic periodic table.",
    ideas: [
      "<b>Neutron stars:</b> in the collapsing core, p + e⁻ → n + ν. The result is about a solar mass of neutrons, ~10 km across, held up by <b>neutron degeneracy pressure</b>, with a maximum mass of ~2 M☉.",
      "<b>Magnetars</b> have fields of 10¹³ gauss and more (a fridge magnet: ~100 G). Charged particles spiraling in a neutron star's field beam radio waves: a <b>pulsar</b>. (The pulses of the first pulsar became the cover of Joy Division's <i>Unknown Pleasures</i>.)",
      "<b>Black holes:</b> a horizon around a singularity, fully described by mass and spin. In general relativity mass curves space (the potential) and spin drags it around (frame dragging).",
      "<b>Hulse–Taylor binary pulsar</b> (found 1974, Nobel Prize 1993): two neutron stars with an 8-hour orbit that shrinks exactly as gravitational-wave emission predicts.",
      "<b>Gravitational waves</b> carry away orbital energy until the pair merges; LIGO's GW150914 (2015) was two black holes of ~36 and ~29 M☉ merging, losing ~3 M☉ to waves.",
      "<b>Neutron-star mergers</b> eject tails of neutron-rich material where the <b>rapid neutron-capture (r-) process</b> builds gold, platinum and uranium.",
      "The <b>nucleosynthetic periodic table:</b> Big Bang (H, He), exploding massive stars, dying low-mass stars, exploding white dwarfs, merging neutron stars and cosmic rays each made their share.",
    ],
    eq: [["Schwarzschild radius", "R_s = \\dfrac{2GM}{c^2} \\approx 3\\ \\text{km}\\,\\dfrac{M}{M_\\odot}"], ["Neutronization", "p + e^- \\to n + \\nu_e"]],
    nums: [["Neutron star", "~1.4–2 M☉ in ~10 km"], ["Magnetar field", "≥ 10¹³ G (fridge magnet ~100 G)"], ["Hulse–Taylor orbit", "~8 hours"], ["GW150914", "36 + 29 M☉ → 62 M☉ + waves"]],
    think: [
      { q: "Compute the Schwarzschild radius of a 10 M☉ black hole and of the Sun.", a: "R_s = 2GM/c²: about 30 km for 10 M☉ and about 3 km for the Sun (which won't become one)." },
    ],
    quiz: [
      { q: "What holds up a neutron star against gravity?", o: ["Neutron degeneracy pressure", "Thermal pressure from fusion", "Electron degeneracy pressure", "Its magnetic field"], a: 0, e: "Electron degeneracy fails above the Chandrasekhar limit; neutrons take over, up to ~2 M☉.", ch: "ch14", s: "14.2" },
      { q: "Why did the Hulse–Taylor binary pulsar earn a Nobel Prize?", o: ["Its orbit shrinks just as GR's gravitational waves predict", "It was the very first pulsar anyone discovered", "It proved that neutron stars can host planets", "It gave the first direct image of a black hole"], a: 0, e: "First indirect detection of gravitational waves, decades before LIGO.", ch: "ch14", s: "14.4" },
      { q: "Most of the gold in the universe was made by…", o: ["the r-process in neutron-star mergers", "fusion in the cores of Sun-like stars", "the first minutes after the Big Bang", "cosmic rays smashing into carbon nuclei"], a: 0, e: "Rapid neutron capture needs neutron-rich ejecta like a merger's tidal tails.", ch: "ch14", s: "14.4" },
      { q: "The Schwarzschild radius of a 10 M☉ black hole is about…", o: ["30 km", "3 km", "300 km", "3000 km"], a: 0, e: "R_s ≈ 3 km × (M/M☉).", ch: "ch14", s: "14.3" },
    ],
    links: [
      { t: "NuDat 3 chart of nuclides", u: "https://www.nndc.bnl.gov/nudat3/", d: "Shown in L16; useful for HW 8" },
      { t: "The pulsar behind ‘Unknown Pleasures’", u: "https://www.scientificamerican.com/blog/sa-visual/pop-culture-pulsar-origin-story-of-joy-division-s-unknown-pleasures-album-cover-video/", d: "Scientific American (from the slides)" },
    ],
  },

  L17: {
    deck: "Astro1_L17.pdf", slides: 12,
    q: "What is the Milky Way?",
    sum: "We live inside the thing we're mapping. After the class telescope's latest images (Polaris, Capella, IC 1848, the Moon, a 60-minute Andromeda), the lecture shows the Milky Way from inside and from a modelled outside view, then what Gaia reveals: a warped, wobbling disk and spiral arms that are waves rather than fixed structures.",
    ideas: [
      "From inside, the Milky Way is a band of stars and dark dust lanes. Its layout (bulge, bar, arms: Perseus, Scutum–Centaurus, Sagittarius, Norma, Outer; the Sun on the Orion spur) has to be reconstructed from distances.",
      "<b>Gaia</b> measures parallaxes and motions of over a billion stars, turning the sky into a 3D map.",
      "Seen edge-on in Gaia data, the disk is <b>warped</b>, and stars move up and down in coherent patterns: the Galaxy is ‘ringing’ like a struck bell, probably after passages of satellite galaxies.",
      "Mapping young, hot stars traces <b>spiral arms</b> near the Sun as overdensities and gaps.",
      "<b>Spiral arms are waves:</b> density waves that stars and gas move through, like a traffic jam that persists while the cars change. Gas piles up in them and forms new stars.",
    ],
    eq: [["Mass inside an orbit", "M(<r) = \\dfrac{v^2 r}{G}"]],
    nums: [["Sun's distance from center", "~8 kpc"], ["Orbital speed of the Sun", "~220 km/s"], ["One Galactic orbit", "~230 million years"], ["Disk diameter", "~30 kpc"]],
    think: [
      { q: "If spiral arms were fixed bands of stars rotating with the disk, what would happen to them over a few orbits?", a: "Inner parts orbit faster than outer parts (differential rotation), so material arms would wind up tighter and tighter and disappear: the ‘winding problem’. Density waves avoid it." },
    ],
    quiz: [
      { q: "Spiral arms are best described as…", o: ["density waves that stars and gas move through", "fixed chains of stars rotating with the disk", "streams of gas falling into the center", "the remains of merged galaxies"], a: 0, e: "Stars enter and leave the arms; the pattern persists, like a traffic jam.", ch: "ch15", s: "15.1" },
      { q: "How far is the Sun from the center of the Milky Way?", o: ["About 8 kpc", "About 0.8 kpc", "About 80 kpc", "About 800 pc"], a: 0, e: "~8 kpc ≈ 26,000 light-years, the radius used in HW 9.", ch: "ch15", s: "15.1" },
      { q: "Gaia shows the Milky Way's disk is…", o: ["warped and wobbling up and down", "perfectly flat and still", "nearly spherical, like a halo", "rotating as a solid body"], a: 0, e: "The warp and vertical waves suggest the disk was disturbed, likely by satellite galaxies.", ch: "ch15", s: "15.3–15.4" },
    ],
    links: [
      { t: "Mapping the spiral arms with Gaia (arXiv 2103.01970)", u: "https://arxiv.org/abs/2103.01970", d: "Paper behind the arm map" },
      { t: "Gaia's warped, rippling disk (A&A 2025)", u: "https://www.aanda.org/articles/aa/pdf/2025/07/aa51668-24.pdf", d: "Paper behind the edge-on view" },
      { t: "OGLE: the Milky Way's rotation curve", u: "https://ogle.astrouw.edu.pl/cont/4_main/str/rotat_curv/", d: "Data for HW 9" },
    ],
    sky: "Polaris, Capella, the Soul Nebula (IC 1848), the Moon and a 60-minute Andromeda.",
  },

  L18: {
    deck: "Astro1_L18.pdf", slides: 19,
    q: "What is the Milky Way? The very high-energy galaxy.",
    sum: "The Milky Way in gamma rays: a glowing disk lit up by cosmic rays, particles moving at nearly the speed of light. How shocks accelerate them, how steeply their numbers fall with energy, the air showers they make in our atmosphere, the Fermi bubbles above and below the center, and weighing the black hole at the center from the orbits of nearby stars.",
    ideas: [
      "<b>Gamma rays</b> sit at the extreme short-wavelength end of the spectrum. NASA's Fermi telescope sees the Galactic disk glowing in them.",
      "That glow comes from <b>cosmic rays</b>, protons and nuclei moving at v ≈ c, hitting interstellar gas. At such speeds kinetic energy grows without limit as v → c.",
      "<b>Shock acceleration:</b> charged particles bounce back and forth across a shock wave (e.g. a supernova remnant), gaining energy each crossing, ‘like a bat hitting a baseball’ again and again.",
      "The cosmic-ray <b>spectrum is a steep power law:</b> about one particle per m² per second at ~10¹¹ eV, one per m² per year at ~10¹⁵ eV, one per km² per year at ~10¹⁸ eV.",
      "When a cosmic ray hits the atmosphere it shatters a nucleus and starts an <b>air shower</b> of secondary particles that rain down to the ground.",
      "The <b>Fermi bubbles</b>, giant gamma-ray lobes above and below the Galactic center, are traces of past outbursts near the central black hole.",
      "<b>Sgr A*</b> is weighed with Kepler's third law: stars like S0-2 orbit it in ~16 years. Simulations show how its accretion flow's magnetic field can accelerate particles too.",
    ],
    eq: [["Relativistic kinetic energy", "K = (\\gamma - 1)\\,mc^2,\\quad \\gamma = \\dfrac{1}{\\sqrt{1 - v^2/c^2}}"], ["Kepler 3 (solar units)", "M = \\dfrac{a^3}{P^2}"]],
    nums: [["Sgr A*", "~4 × 10⁶ M☉"], ["S0-2 orbit", "P ≈ 16 yr, a ≈ 1000 AU"], ["Cosmic-ray flux at 10¹⁵ eV", "~1 per m² per year"]],
    think: [
      { q: "S0-2 orbits Sgr A* with P ≈ 16 years and a ≈ 1000 AU. What is the black hole's mass?", a: "M = a³/P² = 10⁹ / 256 ≈ 4 × 10⁶ M☉: four million Suns in a region smaller than our Solar System." },
    ],
    quiz: [
      { q: "What accelerates most Galactic cosmic rays?", o: ["Shock waves in supernova remnants", "Radiation pressure from bright stars", "The rotation of the Galaxy's disk", "Nuclear fusion in the cores of stars"], a: 0, e: "Diffusive shock acceleration: each crossing adds energy.", ch: "ch15", s: "15.2" },
      { q: "The mass of the Milky Way's central black hole is measured from…", o: ["stellar orbits like S0-2's, via Kepler's third law", "how brightly the black hole shines in visible light", "the size of its shadow in radio images, alone", "the speed of the Sun's own orbit around it"], a: 0, e: "a ≈ 1000 AU and P ≈ 16 yr give ~4 million solar masses.", ch: "ch15", s: "15.3–15.4" },
      { q: "Why do cosmic rays reaching the ground arrive as showers of many particles?", o: ["Each one hits a nucleus and starts a cascade", "They travel together in bunches from the Sun", "Earth's magnetic field splits each one apart", "They come from many supernovae at once"], a: 0, e: "One energetic primary makes millions of secondaries.", ch: "ch15", s: "15.2" },
    ],
    links: [],
    sky: "Andromeda (M31, 4 min) and the Pleiades (M45, 3 min).",
  },

  L19: {
    deck: "Astro1_L19.pdf", slides: 12,
    q: "What shapes the diversity of galaxies?",
    sum: "A galaxy zoo from the Rubin Observatory's first look, JWST's infrared view of the spiral NGC 628 (warm dust tracing the gas), the Milky Way's central black hole and how accreting black holes launch magnetized outflows, and IllustrisTNG simulations that grow a spiral and an elliptical galaxy from the early universe.",
    ideas: [
      "<b>Spirals</b> are gas-rich, rotating disks still forming stars; <b>ellipticals</b> are gas-poor, full of old red stars on random orbits.",
      "JWST's mid-infrared image of NGC 628 shows the <b>interstellar medium</b> as a web of filaments and bubbles: dust heated by young stars glows thermally in the IR.",
      "Every big galaxy has a <b>supermassive black hole</b>. Gas falling in forms an accretion disk; magnetic fields launch outflows and accelerate particles.",
      "That <b>feedback</b> can heat or blow out a galaxy's gas and shut off (quench) star formation.",
      "<b>Simulations (TNG50)</b> follow gas, stars, dark matter and black holes from the early universe: smooth gas accretion builds a disk (a spiral); mergers and feedback make a hot, gas-poor elliptical.",
    ],
    eq: [["Hubble's law", "v = H_0\\,d"], ["Redshift", "z = \\dfrac{\\lambda_{\\text{obs}} - \\lambda_{\\text{rest}}}{\\lambda_{\\text{rest}}},\\quad v \\approx cz"]],
    nums: [["Hubble constant", "H₀ ≈ 70 km/s/Mpc"], ["Hubble time 1/H₀", "≈ 14 billion years"]],
    think: [
      { q: "Why might a galaxy that merged violently end up as an elliptical?", a: "A merger scrambles ordered disk orbits into random ones, drives gas inward to form stars in a burst and feed the black hole, and the feedback then removes or heats the leftover gas, so star formation stops." },
    ],
    quiz: [
      { q: "Why does JWST's mid-infrared image of NGC 628 look like a web of filaments?", o: ["Warm dust in the gas glows in the infrared", "It reveals where the galaxy's dark matter sits", "Its stars are lined up along thin filaments", "It's a processing artifact of the IR camera"], a: 0, e: "Dust heated by young stars radiates in the IR, tracing the gas.", ch: "ch16", s: "16.3" },
      { q: "Compared with spirals, elliptical galaxies typically have…", o: ["little cold gas and mostly old, red stars", "more gas and many more young blue stars", "thin, flat disks that rotate in order", "no supermassive black hole at the center"], a: 0, e: "Gas-poor, old, pressure-supported.", ch: "ch16", s: "16.1" },
      { q: "One way a galaxy can stop forming stars is…", o: ["its black hole heating or expelling the gas", "all of its stars turning into white dwarfs", "dark matter absorbing all of the cold gas", "its spiral arms winding up until they vanish"], a: 0, e: "Active black holes inject huge energy into the surrounding gas.", ch: "ch16", s: "16.4" },
    ],
    links: [
      { t: "Rubin Observatory: First Look (CosmicDS)", u: "https://projects.cosmicds.cfa.harvard.edu/rubin-first-look/", d: "Explore the galaxy zoo from class" },
      { t: "TNG50: a spiral galaxy forms (movie)", u: "https://www.tng-project.org/movies/tng/tng50_single_galaxy_formation_g3_1080p.mp4", d: "IllustrisTNG simulation" },
      { t: "TNG50: an elliptical galaxy forms (movie)", u: "https://www.tng-project.org/movies/tng/tng50_single_galaxy_formation_g2_1080p.mp4", d: "IllustrisTNG simulation" },
    ],
  },

  L20: { deck: null }, L21: { deck: null }, L22: { deck: null }, L23: { deck: null },
};
