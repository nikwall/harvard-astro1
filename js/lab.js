/* The Lab: observing tools, data, software and the hands-on workflows used in lectures, sections and homework. */
window.LAB = {
  // Every outside resource, by id (homework parts and lectures point at these ids).
  tools: {
    sky:       { t: "Clear Sky Chart · Boston", u: "https://test.cleardarksky.com/c/Boston.html", d: "The astronomer's forecast: cloud cover, transparency, seeing and darkness, hour by hour for the next two days.", tag: "observe" },
    lpm:       { t: "Light pollution map", u: "https://www.lightpollutionmap.app/", d: "How bright the sky is where you stand (Bortle class, mag/arcsec²). Shown in L6.", tag: "observe" },
    astrometry:{ t: "astrometry.net", u: "https://nova.astrometry.net/", d: "Upload any sky image; it recognizes the star pattern and returns a FITS file with sky coordinates (WCS).", tag: "image" },
    aij:       { t: "AstroImageJ", u: "https://astroimagej.com/", d: "Free image viewer and photometry tool: apertures, comparison stars, light curves, transit fits.", tag: "image" },
    aladin:    { t: "Aladin Lite (CDS)", u: "https://aladin.cds.unistra.fr/AladinLite/", d: "Interactive sky atlas: overlay surveys and catalogs on any patch of sky to identify what's in your image.", tag: "image" },
    aavso:     { t: "AAVSO Light Curve Generator", u: "https://www.aavso.org/LCGv2/", d: "Magnitudes reported by observers worldwide for variable stars and supernovae (used in L7).", tag: "image" },
    archive:   { t: "NASA Exoplanet Archive", u: "https://exoplanetarchive.ipac.caltech.edu/", d: "Every confirmed exoplanet with its orbit, size, mass and host star. Query it in the browser or from Python.", tag: "data" },
    columns:   { t: "Archive column definitions", u: "https://exoplanetarchive.ipac.caltech.edu/docs/API_PS_columns.html", d: "What pl_orbsmax, pl_bmassj, disc_telescope and the other column names mean.", tag: "data" },
    colab:     { t: "Colab: the Exoplanet Archive in Python", u: "https://colab.research.google.com/drive/1JT11XUtTH7CJ1WTTsnyIBvFUSCf-zOZK?usp=sharing", d: "Class notebook: pull the whole Planetary Systems table with pandas and plot planet mass against orbit size.", tag: "data" },
    explorer:  { t: "Exoplanet explorer (in this app)", u: "#/lab/explorer", d: "The same archive data, plotted live here: pick axes, filter by method, find any planet.", tag: "data", internal: true },
    orbitcode: { t: "Orbit integrator, explained", u: "#/lab/orbits", d: "What the class orbit notebook does, line by line, with a skeleton to start HW 4 #2 from.", tag: "data", internal: true },
    fitsNGC:   { t: "NGC 7331 stack (FITS, Google Drive)", u: "https://drive.google.com/file/d/1EsEGpwTXG_-GOPu4V8lnWRp9oD-xyEIA/view", d: "6 × 10 s, IR-cut filter, taken Sep 23 2026: the raw image for the L7 supernova exercise.", tag: "files" },
    fitsSolved:{ t: "Plate-solved image (FITS, Google Drive)", u: "https://drive.google.com/file/d/1FxdF2lDao1CIAO-NGPKHVmEFqEEo0uod/view", d: "astrometry.net's output (new-image.fits) with the WCS header: open it in AstroImageJ to read coordinates.", tag: "files" },
    toi2046:   { t: "TOI-2046 transit frames (Google Drive folder)", u: "https://drive.google.com/drive/folders/1PBx7Lv_2zUFBa4grHCDvrecFa9Nx3IWl", d: "A night of image frames (toi2046-0001_r.fit …, in time order) of a star with a transiting hot Jupiter, for the transit section.", tag: "files" },
    toiArchive:{ t: "TOI-2046 b in the Exoplanet Archive", u: "https://exoplanetarchive.ipac.caltech.edu/overview/TOI-2046%20b", d: "Published period, radius and mass, to check your transit fit against.", tag: "data" },
    exofop:    { t: "ExoFOP: TOI-2046", u: "https://exofop.ipac.caltech.edu/tess/target.php?id=TOI-2046", d: "TESS follow-up page: coordinates, magnitudes, predicted transit times.", tag: "data" },
  },

  // Hands-on workflows, step by step.
  flows: {
    pipeline: {
      t: "From photons to a supernova magnitude", sub: "L7 · image analysis of NGC 7331",
      lead: "In class we pointed the telescope at the galaxy NGC 7331, where a supernova was going off, and measured how bright it was. You can redo the whole chain at home with free tools.",
      steps: [
        { h: "Get the image", b: "Download the stacked FITS file (six 10-second frames through an IR-cut filter). A FITS file stores the raw counts per pixel plus a header describing the exposure.", tools: ["fitsNGC"] },
        { h: "Plate-solve it", b: "Upload it to astrometry.net. It finds the star pattern in its index and writes a WCS (world coordinate system) into the header, so every pixel has a right ascension and declination. The result comes back as new-image.fits.", tools: ["astrometry", "fitsSolved"] },
        { h: "Open it in AstroImageJ", b: "Load the solved image. Stretch the display until the galaxy and the supernova show up. Hover over stars: AstroImageJ now shows their sky coordinates. Use Aladin Lite to see which catalog stars are in the field.", tools: ["aij", "aladin"] },
        { h: "Measure magnitudes", b: "Put a photometry aperture on the supernova and on a few comparison stars of known magnitude, with a sky annulus around each. Differential photometry: m = m_comp − 2.5 log₁₀(F / F_comp)." },
        { h: "Find the limiting magnitude", b: "What's the faintest star you can still pick out? That sets what this image can and can't detect." },
        { h: "Compare with the world", b: "Look up the same supernova in the AAVSO Light Curve Generator: does your magnitude match other observers' on the same night?", tools: ["aavso"] },
        { h: "Convert to absolute magnitude", b: "With the galaxy's distance, M = m − 5 log₁₀(d / 10 pc). Compare with a type Ia supernova's peak, M ≈ −19.3." },
      ],
    },
    transit: {
      t: "Size up a hot Jupiter: the TOI-2046 transit", sub: "Week 6 section · exoplanet transit characterization",
      lead: "TOI-2046 is a TESS Object of Interest: a star whose light dips every orbit as a giant planet crosses it. A sequence of frames over one night is enough to measure the dip and the planet's size.",
      steps: [
        { h: "Get the frames", b: "Download the frame sequence from the TOI-2046 folder (FITS images, numbered in time order).", tools: ["toi2046"] },
        { h: "Load the sequence", b: "In AstroImageJ open the whole folder as an image sequence (File → Import → Image Sequence). Step through it: the stars should stay put.", tools: ["aij"] },
        { h: "Multi-aperture photometry", b: "Place aperture T1 on TOI-2046 and C2, C3, … on several similar, non-variable stars nearby. AstroImageJ measures all of them in every frame." },
        { h: "Build the light curve", b: "Plot target flux divided by the summed comparison flux against time. Clouds and airmass divide out; what's left is the star's own variation." },
        { h: "Measure the depth", b: "Transit depth δ = ΔF / F. Fit or estimate the drop and its uncertainty; note when it starts and ends." },
        { h: "Get the planet's radius", b: "δ = (R_p / R★)², so R_p = R★ √δ. Use the star's radius from the archive and compare with Jupiter (R_J = 7.15 × 10⁹ cm).", tools: ["toiArchive", "exofop"] },
      ],
    },
    data: {
      t: "Exoplanets as data: the archive in Python", sub: "Class Colab notebook",
      lead: "The NASA Exoplanet Archive answers SQL-like queries over the web. The class notebook pulls the full table into pandas in one line and plots it.",
      code: "import pandas as pd\nimport matplotlib.pyplot as plt\n\nurl = ('https://exoplanetarchive.ipac.caltech.edu/TAP/sync?'\n       'query=select+*+from+ps+where+default_flag=1&format=csv')\ndf = pd.read_csv(url)            # one row per planet\n\nplt.scatter(df['pl_orbsmax'], df['pl_bmassj'], s=3)\nplt.loglog()\nplt.xlabel('Orbit semi-major axis (AU)')\nplt.ylabel('Planet mass (Jupiter masses)')",
      steps: [
        { h: "Open the notebook", b: "Open it in Colab, save a copy to your Drive, run the cells top to bottom.", tools: ["colab"] },
        { h: "Know your columns", b: "pl_orbsmax (semi-major axis, AU), pl_orbper (period, days), pl_bmassj / pl_bmasse (mass in Jupiter / Earth masses), pl_rade (radius, Earth radii), pl_eqt (equilibrium temperature, K), discoverymethod, disc_year, disc_telescope, st_teff / st_mass / st_rad (the host star), sy_dist (distance, pc).", tools: ["columns"] },
        { h: "Ask your own question", b: "Colour the plot by discoverymethod: why do transits find close-in planets and Doppler find massive ones? Where would the Solar System's planets sit? How many hot Jupiters (P < 10 d, M > 0.3 M_J) are there?" },
        { h: "Or explore here first", b: "The explorer in this app plots the same table (snapshot of Nov 13, 2026) without any code.", tools: ["explorer"] },
      ],
    },
  },

  // Physical and astronomical constants, as on the course's constants sheet (cgs units).
  constants: [
    { g: "Physical constants", rows: [
      ["c", "3.00 × 10¹⁰ cm s⁻¹", "speed of light"],
      ["G", "6.67 × 10⁻⁸ cm³ g⁻¹ s⁻²", "gravitational constant"],
      ["h", "6.63 × 10⁻²⁷ erg s", "Planck constant"],
      ["k_B", "1.38 × 10⁻¹⁶ erg K⁻¹", "Boltzmann constant"],
      ["σ", "5.67 × 10⁻⁵ erg s⁻¹ cm⁻² K⁻⁴", "Stefan–Boltzmann constant"],
      ["m_e", "9.11 × 10⁻²⁸ g", "electron mass"],
      ["m_p", "1.67 × 10⁻²⁴ g", "proton mass"],
      ["eV", "1.6 × 10⁻¹² erg", "electron volt"],
    ] },
    { g: "Astronomical constants", rows: [
      ["M☉", "1.99 × 10³³ g", "solar mass"],
      ["R☉", "6.96 × 10¹⁰ cm", "solar radius"],
      ["L☉", "3.83 × 10³³ erg s⁻¹", "solar luminosity"],
      ["AU", "1.50 × 10¹³ cm", "astronomical unit"],
      ["pc", "3.09 × 10¹⁸ cm", "parsec"],
      ["ly", "9.46 × 10¹⁷ cm", "light-year"],
      ["yr", "3.16 × 10⁷ s", "year"],
    ] },
    { g: "Earth & Jupiter", rows: [
      ["M⊕", "5.97 × 10²⁷ g", "Earth mass"],
      ["R⊕", "6.37 × 10⁸ cm", "Earth radius"],
      ["M_J", "1.90 × 10³⁰ g", "Jupiter mass"],
      ["R_J", "7.15 × 10⁹ cm", "Jupiter radius"],
    ] },
    { g: "Energies, angles, units", rows: [
      ["½ m v²", "erg", "kinetic energy"],
      ["k_B T", "erg", "thermal energy (per particle)"],
      ["G M m / r", "erg", "gravitational energy"],
      ["θ = s / d", "radians", "angular size (s = size, d = distance)"],
      ["erg", "1 g cm² s⁻²", "energy"],
      ["dyne", "1 g cm s⁻²", "force"],
      ["kpc · Mpc", "10³ pc · 10⁶ pc", "kiloparsec · megaparsec"],
    ] },
  ],

  // How the in-class exams are built (from the Fall 2026 midterm instructions).
  examFormat: {
    points: 40,
    parts: [["Multiple choice", "answer 4 of 6", "1 pt each", 4], ["Short answer", "answer 2 of 3", "3 pts each", 6], ["Descriptive", "answer 3 of 4", "6 pts each", 18], ["Calculation", "answer 1 of 2", "12 pts", 12]],
    rules: ["One prepared cheat sheet and a calculator; nothing else.", "Like the homework: diagrams, calculations and written reasoning together. Labeled diagrams and explanations count as much as the number.", "Round to 1–3 significant figures.", "If you don't remember a detail, still write down your conceptual thinking: it earns credit."],
  },

  // A skeleton of the class orbit integrator (cgs units), for the HW 4 #2 walkthrough page.
  orbitCode: "import numpy as np\nimport matplotlib.pyplot as plt\n\nG = 6.67e-8        # cm^3 g^-1 s^-2\nM = 2e33           # star mass in g (about 1 solar mass)\nAU = 1.5e13        # cm\n\na = 1.0 * AU       # orbit radius: change this for 51 Peg b\nv_circ = np.sqrt(G * M / a)\n\nx, y = a, 0.0      # start on the +x axis\nvx, vy = 0.0, v_circ\n\nt_max = 3.16e7     # total time in s: set to a few orbital periods\nn_steps = 2000     # want well over 100 steps per orbit\ndt = t_max / n_steps\n\nts, xs, ys, vxs = [], [], [], []\nfor i in range(n_steps):\n    r = np.sqrt(x**2 + y**2)\n    ax, ay = -G * M * x / r**3, -G * M * y / r**3   # gravity points at the star\n    vx, vy = vx + ax * dt, vy + ay * dt               # update velocity first ...\n    x, y = x + vx * dt, y + vy * dt                   # ... then position\n    ts.append(i * dt); xs.append(x); ys.append(y); vxs.append(vx)\n\nplt.plot(xs, ys); plt.plot(0, 0, 'o')\nplt.axis('equal'); plt.xlabel('x (cm)'); plt.ylabel('y (cm)')\nplt.show()",
};
