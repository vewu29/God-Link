"use strict";
/* ================= DRIVE MODE — Minnesota permit & driving track =================
   Inspired by the Minnesota Driver's Manual (topic order and FACTS only).
   Every explanation, chapter, and test question below is ORIGINAL Code Block
   prose — no manual sentences, tables, or illustrations are reproduced.
   Traffic laws, sign meanings, and numbers are facts and are fine to teach.
   This file loads AFTER cs-mode.js and BEFORE the main scripts. When Drive
   mode is saved, the main data declarations pick the DRIVE arrays, and Drive
   progress uses its own storage keys, so C++, C#, and Drive never overwrite
   each other. */

var DRIVE_BLOCKS = [
  { name: "Stop Sign Block", short: "Stop", chapter: "Manual Ch. 5 · Signs, Signals & Markings", color: "#53b1fd", icon: "i-stop", verb: "halt",
    line: "A red octagon means STOP.",
    explain: "The stop sign is the only eight-sided sign on the road, so you can know it by shape alone — even covered in snow or seen from the back. Red means stop. Roll up to the stop line, come to a complete stop, look left, right, and left again, and go only when the way is clear." },
  { name: "Yield Sign Block", short: "Yield", chapter: "Manual Ch. 5 · Signs, Signals & Markings", color: "#38bdf8", icon: "i-yield", verb: "yield",
    line: "An upside-down triangle means YIELD.",
    explain: "Yield means slow down and give the road to others. You do not always have to stop — but you must be ready to. If another car, a bike, or a person on foot is coming, they go first, and you wait until there is a safe gap." },
  { name: "Warning Sign Block", short: "Warning", chapter: "Manual Ch. 5 · Signs, Signals & Markings", color: "#22d3ee", icon: "i-warn", verb: "watch",
    line: "A yellow diamond warns of danger ahead.",
    explain: "Diamond-shaped yellow signs are the road's early-warning system: a curve, a merging lane, a slippery stretch, a crossing ahead. When you see one, ease off the gas and get ready — the sign is telling you the road is about to change." },
  { name: "Speed Sign Block", short: "Speed", chapter: "Manual Ch. 5 · Signs, Signals & Markings", color: "#2fc4e8", icon: "i-gauge", verb: "pace",
    line: "A white rectangle shows the speed limit.",
    explain: "White rectangular signs carry rules, and the speed limit is the most famous of them: the fastest you may legally drive on that road in perfect conditions. Rain, snow, fog, or heavy traffic can make even the posted number too fast — the basic speed law always applies." },
  { name: "Turn Signal Block", short: "Signal", chapter: "Manual Ch. 3 · Traffic Laws & Operation", color: "#3ec6dd", icon: "i-swap-h", verb: "signal",
    line: "Signal at least 100 feet before you turn.",
    explain: "Your turn signal is how you talk to everyone around you. Minnesota law says switch it on at least 100 feet before the turn — about half a city block — and keep it on through the turn, so nobody has to guess what you are about to do." },
  { name: "School Bus Block", short: "Bus Stop", chapter: "Manual Ch. 4 · Sharing the Road", color: "#4a90d9", icon: "i-bus", verb: "pause",
    line: "Stop at least 20 feet from a bus with red lights flashing.",
    explain: "When a school bus flashes red lights and swings out its stop arm, children are crossing. Stop at least 20 feet away — whether you are behind the bus or coming toward it — and stay stopped until the arm folds away and the red lights go dark. The only exception: a bus on the other side of a separated roadway." },
  { name: "Alcohol Limit Block", short: "BAC 0.08", chapter: "Manual Ch. 8 · Impaired Driving", color: "#6d9df5", icon: "i-no-drink", verb: "limit",
    line: "It is illegal to drive with a BAC of 0.08 or higher.",
    explain: "BAC — blood alcohol concentration — measures how much alcohol is in your body. At 0.08 or higher, driving is illegal in Minnesota for adult drivers, and impairment actually begins with the very first drink. For drivers under 21, the Not-a-Drop law makes ANY detectable alcohol illegal." },
  { name: "Following Block", short: "3 Seconds", chapter: "Manual Ch. 4 · Sharing the Road", color: "#7aa5f8", icon: "i-gap", verb: "space",
    line: "Keep at least 3 seconds of space behind the car ahead.",
    explain: "Pick a fixed point — a sign, a shadow, a bridge. When the car ahead passes it, count one-thousand-one, one-thousand-two, one-thousand-three. If you reach the point before you finish counting, you are too close. That gap is your time to react if they brake hard." },
  { name: "Winter Gap Block", short: "Winter Gap", chapter: "Manual Ch. 6 · Driving Conditions", color: "#5ea8f7", icon: "i-snow", verb: "widen",
    line: "Double your following distance on snow and ice.",
    explain: "On snow and ice your tires grip far less, and stopping can take many times longer. Double the three-second gap — or more — slow down early and gently, and remember that bridge decks freeze before the rest of the road does." },
  { name: "Right of Way Block", short: "Right Way", chapter: "Manual Ch. 3 · Traffic Laws & Operation", color: "#4fb3ff", icon: "i-cross", verb: "order",
    line: "Yield to the car on your right at uncontrolled intersections.",
    explain: "An uncontrolled intersection has no signs or lights at all. If two drivers arrive at the same time, the driver on the LEFT yields to the driver on the RIGHT. And remember: right-of-way is something you give, never something you take — even when it is 'yours,' a crash helps nobody." },
  { name: "Pedestrian Block", short: "Crosswalk", chapter: "Manual Ch. 4 · Sharing the Road", color: "#38a3f8", icon: "i-walk", verb: "cross",
    line: "Stop for pedestrians in crosswalks.",
    explain: "People on foot have the right-of-way in crosswalks — marked or unmarked, at corners and mid-block crossings alike. Stop and stay stopped until they have crossed your lane. Never pass a car that is stopped at a crosswalk: it may be hiding a person you cannot see." },
  { name: "Headlight Block", short: "Headlights", chapter: "Manual Ch. 6 · Driving Conditions", color: "#2fb9e8", icon: "i-beam", verb: "shine",
    line: "Turn on your headlights at sunset.",
    explain: "Minnesota law: headlights on at sunset, and keep them on until sunrise. Also switch them on in rain, snow, hail, sleet, or fog — and any time you cannot clearly see 500 feet ahead. Headlights are not just for seeing; they are for BEING seen." },
  { name: "No Texting Block", short: "Hands-Free", chapter: "Manual Ch. 3 · Traffic Laws & Operation", color: "#3b8ef0", icon: "i-phone-off", verb: "focus",
    line: "Texting while driving is illegal in Minnesota.",
    explain: "Reading or sending a text, email, or web page while driving is illegal for every driver. Minnesota's hands-free law means a phone may only be used by voice or one-touch while you drive — and drivers under 18 may not use a phone at all behind the wheel, except to call for emergency help." },
  { name: "Seatbelt Block", short: "Belt Up", chapter: "Manual Ch. 3 · Traffic Laws & Operation", color: "#2f9be8", icon: "i-belt", verb: "buckle",
    line: "Everyone in the car must wear a seatbelt.",
    explain: "Minnesota's seatbelt law covers the driver and every passenger, front seat and back — and an officer can stop a vehicle for a belt violation alone. Belts keep you in the seat so you can keep control, and they are the simplest crash protection ever invented." },
  { name: "Move Over Block", short: "Move Over", chapter: "Manual Ch. 4 · Sharing the Road", color: "#7fb2e5", icon: "i-move-over", verb: "shift",
    line: "Move over or slow down for stopped emergency vehicles.",
    explain: "When an emergency vehicle — police, fire, ambulance, or a tow truck — is stopped ahead with lights flashing, Minnesota's Move Over law says change lanes AWAY from it if you safely can. If you cannot change lanes, slow down. People are working outside those vehicles." },
  { name: "Railroad Block", short: "Railroad", chapter: "Manual Ch. 4 · Sharing the Road", color: "#6495ed", icon: "i-rail", verb: "look",
    line: "Stop 15 to 50 feet before railroad tracks.",
    explain: "When lights flash, bells ring, or a train is coming, stop between 15 and 50 feet from the nearest rail. Look both ways — a second train can hide behind the first. Never stop ON the tracks, and never try to race a train: it cannot stop for you." },
  { name: "Hill Parking Block", short: "Hill Park", chapter: "Manual Ch. 3 · Traffic Laws & Operation", color: "#3f7de0", icon: "i-hill", verb: "turn",
    line: "Facing downhill, turn your wheels toward the curb.",
    explain: "Parked on a hill, your wheels become a safety plan. Facing downhill, point them TOWARD the curb — if the car rolls, the curb catches it. Facing uphill with a curb, point them AWAY, so a rolling car swings back into the curb. Either way: parking brake on." },
  { name: "Green Arrow Block", short: "Green Arrow", chapter: "Manual Ch. 5 · Signs, Signals & Markings", color: "#31b8c6", icon: "i-go", verb: "go",
    line: "A green arrow means you may go that direction.",
    explain: "A green arrow gives you a protected move: traffic facing you is stopped, and you may go the way the arrow points. When the arrow ends, the steady green ball may still let you turn — but then you must yield to oncoming traffic and people crossing." },
  { name: "Red Light Block", short: "Red Light", chapter: "Manual Ch. 5 · Signs, Signals & Markings", color: "#0ea5e9", icon: "i-light", verb: "stop",
    line: "Stop at red; you may turn right after stopping.",
    explain: "A steady red light means stop and stay stopped. After a complete stop — and unless a sign says NO TURN ON RED — you may turn right, yielding to everyone lawfully in the intersection. The stop comes first, every time; rolling through is both illegal and dangerous." },
  { name: "Blind Spot Block", short: "Blind Spot", chapter: "Manual Ch. 3 · Traffic Laws & Operation", color: "#2563eb", icon: "i-eye-off", verb: "check",
    line: "Check mirrors and blind spots before changing lanes.",
    explain: "Your mirrors leave two hidden wedges beside the back of your car — the blind spots. Before any lane change: signal, check the mirrors, then glance quickly over your shoulder into the blind spot. Signal, mirror, shoulder — in that order, every time." },
  { name: "Hydroplane Block", short: "Hydroplane", chapter: "Manual Ch. 6 · Driving Conditions", color: "#0284c7", icon: "i-waves", verb: "glide",
    line: "Ease off the gas if the car starts to hydroplane.",
    explain: "In heavy rain, water can lift your tires completely off the road — hydroplaning — sometimes at speeds as low as 35 mph. The steering suddenly feels light and the car stops answering. Do not brake hard or yank the wheel: ease your foot off the gas and let the tires find the road again as you slow." },
  { name: "After a Crash Block", short: "Crash Steps", chapter: "Manual Ch. 3 · Traffic Laws & Operation", color: "#0369a1", icon: "i-burst", verb: "act",
    line: "Stop, help the hurt, call 911, share information.",
    explain: "If you are in a crash: stop — leaving the scene is a crime. Check for injuries and call 911. Move vehicles out of traffic if it is safe, turn on your hazard lights, and exchange names, license, and insurance information with the other driver. Stay calm; the steps are the same every time." },
  { name: "No Passing Block", short: "No Passing", chapter: "Manual Ch. 3 · Traffic Laws & Operation", color: "#60a5fa", icon: "i-flag", verb: "stay",
    line: "Do not pass when a solid yellow line is on your side.",
    explain: "Yellow lines separate traffic moving in opposite directions. A solid yellow line on YOUR side of the center line means no passing. A broken yellow line means you may pass when it is safe. Two solid yellows mean nobody passes, from either direction." },
  { name: "Night Speed Block", short: "Night", chapter: "Manual Ch. 6 · Driving Conditions", color: "#7cc4ff", icon: "i-moon", verb: "slow",
    line: "Slow down at night; never outdrive your headlights.",
    explain: "At night you can only react to what your headlights show you — about 350 feet on high beam. If you are driving so fast that you could not stop inside that lit distance, you are outdriving your headlights. Slow down, use high beams on empty dark roads, and dim them for others." }
];

/* ---------- Drive Library chapters (9) — original retellings of the manual's chapters ---------- */
var DRIVE_CHAPTERS = [
  { title: "Your License to Drive", chapter: "Manual Ch. 1 · Your License to Drive", color: "#53b1fd", scene: 0, line: "Score 80% or higher on the knowledge test to pass.",
    content: { story: ["A driver's license is a promise: you showed the state you know the rules and can see well enough to drive safely. In Minnesota the journey starts at 15, when you may apply for an instruction permit — but first comes driver education. Students under 18 finish classroom instruction and enroll in behind-the-wheel training, and they carry a certificate of enrollment — the famous Blue Card or Pink Card — as proof.", "The permit itself is earned at the exam station with two screenings. The knowledge test asks multiple-choice and true-or-false questions about traffic laws and road signs, and you need 80 percent to pass. Your vision is screened too: at least 20/40, with at least 105 degrees of side vision. You may take only one knowledge test per day — and if the first two tries fail, the third test costs a $10 fee, so studying first is the smart play.", "A permit is not a license to drive alone: a licensed driver must ride beside you while you practice. Teen drivers log supervised hours — 50 hours in total, 15 of them at night — and hold the permit at least six months before the road test. Pass that, and the provisional license begins, with training wheels of its own for the first months."],
      big: "Permit at 15 with driver education, pass the knowledge test at 80% and the vision screening, practice supervised for at least six months — then the road test earns the license.",
      caption: "The front door of driving: a card to earn, a test to pass, and a road ahead. Tap Play to walk the path.",
      demo: ["Age 15 + driver education: the Blue Card is in hand.", "Knowledge test day — 80% or higher passes.", "Vision screening: 20/40 and 105 degrees of side vision.", "Supervised practice: 50 hours, 15 of them at night.", "Road test passed — the license is yours. Drive like it."] } },
  { title: "Your Vehicle", chapter: "Manual Ch. 2 · Your Vehicle", color: "#38bdf8", scene: 13, line: "Check the car before the car checks you.",
    content: { story: ["You are responsible for the machine you drive — not just how you steer it, but whether it is fit for the road at all. Minnesota expects working headlights (high and low beam), taillights, brake lights, and turn signals, plus brakes that stop straight, a horn, mirrors, seatbelts that work, and tires with real tread. If it is required equipment, it has to work — every trip, not just test day.", "The pre-drive habit takes sixty seconds: walk around the car. Look at the tires, glance under it for leaks, check that the lights and windows are clean, and make sure nothing — and nobody — is behind you before you back out. Inside: adjust the seat so you can reach everything, set the mirrors, and buckle up before the car moves an inch.", "Little machines need little care. Windshield washer fluid runs out exactly when the slush flies; wiper blades smear before they fail completely; a cracked headlight lens fills with moisture and dims your light. Catching these early is cheap. Ignoring them until a dark, rainy highway is not."],
      big: "Working lights, brakes, signals, belts, mirrors, and tread are the law — and the sixty-second walk-around before you drive is the habit that keeps them honest.",
      caption: "The blueprint check: lights, tires, mirrors, belts — a full car, checked in a minute. Tap Play for the walk-around.",
      demo: ["Tires first: tread deep, air right, nothing flat.", "Lights on: headlights, brake lights, signals — all glowing.", "Mirrors set and windows clean. You cannot avoid what you cannot see.", "Belt buckled before the car moves. Every seat, every trip.", "Walk-around done. This car is ready — and so is its driver."] } },
  { title: "Traffic Laws & Vehicle Operation", chapter: "Manual Ch. 3 · Traffic Laws and Vehicle Operation", color: "#22d3ee", scene: 4, line: "10 in alleys, 30 in town, 55 elsewhere — unless a sign says otherwise.",
    content: { story: ["Speed is the law you feel in your right foot. Under ideal conditions Minnesota's limits are 10 mph in alleys, 30 mph on urban and town roads, and 55 mph everywhere else a sign does not override. But above all of them sits the basic speed law: never drive faster than is reasonable for the weather, the traffic, and the road in front of you. A posted 55 on glare ice is a legal limit and a terrible idea.", "Signals, lanes, and turns run on communication. Signal at least 100 feet before a turn. Keep right except to pass. On two-lane highways posted 55 or higher, the limit rises by 10 mph only while you are lawfully passing. And know the no-parking map: never within 10 feet of a fire hydrant, 20 feet of a crosswalk, or 50 feet of a railroad rail.", "Some numbers carry heavy consequences. Extra fines begin at 20 mph over the limit. Drive more than 100 mph and your license is revoked for at least six months. Every rule in this chapter exists because somebody, somewhere, learned the reason the hard way."],
      big: "10 / 30 / 55 are the default limits, the basic speed law outranks them all, signals go on 100 feet early, and 100+ mph costs the license for six months.",
      caption: "The fork in the road: every drive is a chain of small, legal choices. Tap Play to drive the chapter.",
      demo: ["Alley ahead: 10 mph, walking pace plus a little.", "In town: 30 mph — and a sign can always say less.", "Open road: 55 mph, weather permitting.", "Signal on — 100 feet before the turn, every time.", "The basic law rides on top: reasonable beats posted."] } },
  { title: "Sharing the Road", chapter: "Manual Ch. 4 · Sharing the Road", color: "#2fc4e8", scene: 20, line: "Give people room — the road belongs to everyone on it.",
    content: { story: ["Nobody owns the road. People walking have the right-of-way in crosswalks; a person with a white cane or a guide dog must never be rushed or blocked. People on bicycles are legal vehicles: pass with at least three feet of space between your car and the rider, and expect bikes in your blind spot before every turn. Motorcycles get the same following distance as cars — or more, because they can stop and swerve in ways cars cannot.", "Big vehicles need big understanding. Trucks have huge blind spots — the No-Zones along both sides, behind, and right in front. If you cannot see the truck driver's mirrors, the driver cannot see you. Trucks also stop longer and turn wider; never squeeze beside one in a turn, and never cut in front of one and brake.", "Some vehicles carry the whole community: school buses with flashing reds (stop at least 20 feet away), emergency vehicles (move over or slow down), and trains, which cannot stop, swerve, or forgive. Sharing the road means reading each of these neighbors and giving each the room its job requires."],
      big: "Stop for people in crosswalks, give bikes three feet, respect the truck's blind No-Zones, stop 20 feet for a flashing school bus, and always move over for emergency lights.",
      caption: "Many voices, one road: walkers, riders, trucks, buses, and trains all sharing the same street. Tap Play.",
      demo: ["A person in the crosswalk: stop, and stay stopped.", "Passing a bike: three feet of space, minimum.", "Beside a truck: if you cannot see its mirrors, it cannot see you.", "Bus lights flash red: stop 20 feet back.", "Siren behind: pull right, stop, let it through."] } },
  { title: "Signs, Signals & Pavement Markings", chapter: "Manual Ch. 5 · Signs, Signals, and Pavement Markings", color: "#3ec6dd", scene: 5, line: "Shape tells the story before the words do.",
    content: { story: ["Road signs speak two languages at once: shape and color. Learn them and you can read a sign before you can read its words. Octagon means stop. Upside-down triangle means yield. Diamond means warning. A round sign and an X-shaped crossbuck both speak of railroad crossings ahead. A pentagon — a house shape — guards school zones and crossings. Rectangles carry rules and directions.", "Colors carry the second half of the message. Red means stop or prohibition. Yellow warns. Orange means construction and work zones — slow down and expect people. Green guides: distances, exits, directions. Blue points to services like fuel and food; brown to parks and recreation. White rectangles hold the regulations, including the speed limit itself.", "Paint talks too. Yellow lines separate opposite directions: solid on your side, no passing; broken, passing is allowed when safe. White lines separate lanes moving the same way: broken means changes are allowed, solid means stay put. And the lights: green go, yellow prepare to stop, red stop — with flashing red acting as a stop sign and flashing yellow asking for caution. Shape, color, paint, light: four alphabets, one road."],
      big: "Octagon stop, triangle yield, diamond warning, pentagon school, round railroad; red prohibits, yellow warns, orange works, green guides — and paint repeats it all on the pavement.",
      caption: "Three doors of the road: stop, yield, warning — pick the right one by shape alone. Tap Play.",
      demo: ["Eight sides, red: STOP — no words needed.", "Point-down triangle: YIELD — others go first.", "Yellow diamond: WARNING — something is changing ahead.", "Orange ahead: a work zone. Slow down, watch for people.", "Shape and color read first. Words confirm. Drive on."] } },
  { title: "Driving Conditions", chapter: "Manual Ch. 6 · Driving Conditions", color: "#4a90d9", scene: 15, line: "Slow down early — the weather always votes.",
    content: { story: ["Minnesota driving is weather driving. Rain first: in a heavy downpour, ordinary car tires can begin to hydroplane at about 35 mph, riding on water instead of road. The cure is prevention — good tires and slower speeds — and the reaction is gentle: ease off the gas, no hard braking, no yanking the wheel, until the tires bite again.", "Winter writes the hardest chapters. Snow and ice stretch stopping distances to many times their dry length, bridges and overpasses freeze before the road around them, and black ice hides in shaded patches that look like plain pavement. Double your following distance, brake and steer gently, keep the windshield and ALL the windows scraped clear, and leave the cruise control off — a machine that holds speed cannot feel the ice let go.", "Night and fog shrink the world to what your lights can reach. Headlights belong on from sunset to sunrise and whenever you cannot see 500 feet; use low beams in fog, because high beams bounce back at you. Dim for oncoming traffic within 1,000 feet and when following within 200 feet. However dark it gets, one rule holds: never drive faster than you can stop inside the distance you can see."],
      big: "Hydroplaning can start near 35 mph in heavy rain; on snow and ice double the gap and stay gentle; at night and in fog, low beams and a speed you can stop within — always.",
      caption: "The safety net chapter: rain, ice, and darkness all pull at the car — gentle hands catch every fall. Tap Play.",
      demo: ["Rain pours: speed drops, gap grows, grip returns.", "Bridge ahead on a cold morning: it may be ice before the road is.", "Steering feels light — hydroplaning! Ease off the gas… grip is back.", "Fog rolls in: low beams on, high beams off.", "Night rule spoken aloud: never outdrive your headlights."] } },
  { title: "Your Driving Privileges", chapter: "Manual Ch. 7 · Your Driving Privileges", color: "#6d9df5", scene: 24, line: "A license is earned daily, not once.",
    content: { story: ["A license is not a trophy you win once; it is a privilege the state lends you and reviews every day you drive. Points and records follow violations, and serious ones — or a pile of small ones — can bring warnings, suspension, or revocation: the license taken away for a season or longer. Driving during a suspension is its own violation and extends the trouble.", "Some acts end privileges fast. Driving over 100 mph revokes for at least six months. A DWI revokes immediately and adds criminal penalties. Leaving the scene of a crash, refusing the implied-consent test after a DWI arrest, or driving without insurance all carry heavy consequences of their own. The pattern is simple: the more a choice endangers others, the faster the privilege disappears.", "Keeping the license is mostly ordinary faithfulness: obey the limits, keep insurance current, keep your address updated, renew on time, and drive the way you drove on test day — when an examiner was watching. The secret of a clean record is that there is no secret: it is the same careful driving, repeated."],
      big: "Privileges are kept by ordinary faithfulness and lost fastest by speed over 100, DWI, hit-and-run, and driving uninsured or suspended — the examiner is always, in a sense, watching.",
      caption: "Words on cards, hanging where you can see them: privilege, record, renewal, responsibility. Tap Play.",
      demo: ["A ticket is not just a fine — it goes on the record.", "100+ mph: revocation for at least six months.", "Insurance lapses: the privilege is at risk.", "Renewal arrives: on time, address current, eyes checked.", "Clean record, year after year: careful driving, repeated."] } },
  { title: "Impaired Driving", chapter: "Manual Ch. 8 · Impaired Driving", color: "#7aa5f8", scene: 26, line: "If you drink, don't drive. If you drive, don't drink.",
    content: { story: ["Alcohol is a depressant: it slows the body and quietly dismantles the exact skills driving needs — judgment first, then vision, reaction time, steering, perception, coordination, and attention. The cruelest effect is on judgment itself: impaired drivers misjudge how impaired they are. Ability begins to decline after the very first drink, long before it feels like it has.", "The law draws a bright line at a blood alcohol concentration of 0.08 (0.04 for commercial drivers) — but impairment starts far below the line. One standard drink — a 12-ounce beer, a 5-ounce glass of wine, a typical mixed drink — carries about the same alcohol as the others, and the body clears roughly one drink per hour. Coffee, cold air, and exercise do not speed that up. Only time does.", "Minnesota adds two more layers. Implied consent: by driving, you agree to a chemical test if arrested for DWI, and refusing brings revocation of its own. Not a Drop: drivers under 21 may not drive with any detectable alcohol at all. And drugs impair too — illegal drugs, many prescriptions, even household products. The safe plan is made before the first drink: a designated driver, a taxi, a friend, a couch."],
      big: "Impairment starts with the first drink; 0.08 is the legal line, time is the only cure, implied consent backs the test, and under 21 the rule is Not a Drop — plan the ride before the drink.",
      caption: "The detective chapter: find the real cause — alcohol fools judgment first, so the plan must be made sober. Tap Play.",
      demo: ["One drink in: judgment is already slipping, silently.", "Beer, wine, mixed drink: one standard drink each.", "An hour passes: roughly one drink cleared. Only time works.", "Arrested for DWI: implied consent means the test applies.", "Under 21: Not a Drop. The plan was a designated driver."] } },
  { title: "Final Review — The Cram Chapter", chapter: "Manual Ch. 9 · Review & Information Directory", color: "#5ea8f7", scene: 25, line: "Know the numbers, read the shapes, pass the test.",
    content: { story: ["Test week. The knowledge test passes at 80 percent — on the real test that is 32 of 40 questions — and the fastest way to get there is to know the numbers cold. Speeds: 10 in alleys, 30 in town, 55 elsewhere. Distances: signal 100 feet early, stop 20 feet from the bus, park 10 feet from hydrants, stop 15 to 50 feet from the rails. Limits: BAC 0.08, hydroplaning near 35, headlights when you cannot see 500.", "Then the shapes and colors, the test's favorite questions. Octagon stop, triangle yield, diamond warning, pentagon school, round railroad warning. Red prohibits, yellow warns, orange builds, green guides, blue serves, brown plays. Solid yellow on your side: no passing. Flashing red: stop like a sign. Flashing yellow: proceed with care. Three seconds behind, doubled on ice.", "Finally, the driver's character — the questions behind the questions. Right-of-way is given, not taken. The basic speed law outranks the posted number. If you drink, don't drive; if you drive, don't drink. Walk into the exam station knowing the numbers, reading the shapes, and thinking like that driver, and the test is simply the paperwork."],
      big: "Numbers cold, shapes by heart, character set: 80% passes, and every fact in this chapter is one you have already drilled in the Sandbox.",
      caption: "The pin-up cards of everything: numbers, shapes, and rules — all on the corkboard before the test. Tap Play.",
      demo: ["10, 30, 55: alley, town, open road.", "100 to signal, 20 from the bus, 0.08 the line.", "Octagon, triangle, diamond, pentagon, round.", "Three seconds of space — doubled on ice.", "32 of 40 is a pass. You know this cold. Go get the permit."] } }
];

var DRIVE_DEEP = [
  { more: ["Test-day logistics reward the prepared: bring proper identification, and under 18, the Blue Card or Pink Card from driver education. You may take only one knowledge test per day, so a failed morning cannot be retried that afternoon — another reason the studying happens first.", "The road test has a beginning before the driving: the examiner checks your vehicle's safety equipment — lights, signals, brakes, horn, belts. A burned-out brake light can end the test before it starts, which is why Chapter 2's walk-around is a test skill, not just a habit."],
    ex: { code: "THE PERMIT PATH\nAge 15 → driver education (Blue/Pink Card)\nKnowledge test → 80% or higher passes\nVision → 20/40, 105° side vision\nPractice → 50 supervised hours, 15 at night\nPermit held → at least 6 months (under 18)\nRoad test → provisional license",
          walk: ["Step 1: eligibility — 15 years old and enrolled in driver education.", "Step 2: the knowledge test — multiple choice and true/false, 80% to pass.", "Step 3: vision screening — the state checks your eyes before your driving.", "Step 4: practice — supervised hours, logged and signed.", "Step 5: the road test — vehicle check first, then real driving judged."] },
    mistake: "Showing up to retake a failed knowledge test the same afternoon. Only one test per day is allowed — and after two consecutive failures, a $10 fee applies to the third and every later try. Study first; the fee is optional." },
  { more: ["Tire tread is the car's handshake with the road. Worn tires lengthen every stop and invite hydroplaning, which is why the manual spends time on tires, inflation, and inspection at least once a year for headlight aim. Your vehicle chapter knowledge is tested twice: once on paper, and once by the examiner's equipment check.", "Carbon monoxide is the quiet hazard of vehicle care: an odorless, colorless gas in exhaust that can poison. Never warm up a car in a closed garage — back out, or open the door fully."],
    ex: { code: "THE 60-SECOND WALK-AROUND\n1. Tires — tread, air, damage\n2. Lights — head, tail, brake, turn\n3. Glass — clean, wipers ready\n4. Leaks — look beneath the car\n5. Behind — nothing and nobody there\nThen: seat, mirrors, belt — drive.",
          walk: ["The walk-around catches problems while they are still cheap.", "Lights fail silently from the driver's seat — only looking reveals them.", "The 'behind' check matters most with small children and pets near driveways.", "Inside adjustments come last, in a fixed order: seat, mirrors, belt."] },
    mistake: "Adjusting mirrors while rolling. Mirrors set in motion are mirrors set wrong — and the reaching and glancing steal seconds of attention at exactly the wrong time. Seat, mirrors, belt, THEN drive." },
  { more: ["The +10 passing allowance surprises many learners: on a two-lane highway posted 55 or higher, the legal limit rises by 10 mph only while you are lawfully passing another vehicle traveling the same direction. It is a passing tool, not a new cruising speed — and it never applies in town.", "Approaching an intersection too fast quietly forfeits your right-of-way: the manual notes that a driver who approaches at an unlawful speed loses the right-of-way privilege that lawful speed would have carried. Speed choices rewrite legal choices."],
    ex: { code: "NUMBERS OF THE ROAD\n10 mph — alleys\n30 mph — urban & town roads\n55 mph — elsewhere (unless signed)\n+10 mph — only while lawfully passing, 2-lane, 55+\n20 over — additional fines begin\n100+ mph — revocation, 6 months minimum",
          walk: ["The three defaults cover every unsigned road in Minnesota.", "Posted signs override defaults — the sign always wins over memory.", "The passing allowance is temporary: finish the pass, return to the limit.", "The two penalty numbers are the chapter's warning lights: 20 over, and 100."] },
    mistake: "Treating the posted limit as a target in bad weather. The basic speed law can make 40 illegal on a 55 road when ice, fog, or traffic says 40 is too fast. 'But the sign said 55' is not a defense." },
  { more: ["Bicycles deserve a second thought about doors: after parallel parking, check mirrors and look before opening the door into a bike lane. And when turning right across a bike lane, yield to riders going straight — the most common city crash pattern between cars and bikes.", "Funeral processions are a Minnesota courtesy written into practice: when a procession identifies itself with headlights on, yield to it, do not cut through it, and do not pass it on a two-lane road. It costs a minute; it returns dignity."],
    ex: { code: "SPACE TO GIVE\n3 feet — minimum when passing a bicycle\nSame or more — following a motorcycle\n20 feet — stop behind a flashing school bus\nA full lane — move over for stopped emergency lights\nEverything — the truck's No-Zone blind spots",
          walk: ["Every entry is a distance between you and somebody vulnerable.", "The bicycle number is a MINIMUM — more is always welcome.", "Following a motorcycle like a car is the floor, not the ceiling.", "The school bus and move-over rules protect people standing outside vehicles."] },
    mistake: "Passing a car that is stopped at a crosswalk. It is illegal and it is how crosswalk crashes happen: the stopped car is often hiding the very person who made it stop. Wait until you can see the whole crosswalk is clear." },
  { more: ["Two sign families get confused on every test: the round railroad ADVANCE warning sign (a yellow circle far before the crossing) and the X-shaped CROSSBUCK (white, AT the crossing, treated as a yield). One warns from a distance; the other stands guard at the tracks themselves.", "A white sign with a red circle and slash — a red ring around a picture — means the pictured action is prohibited: no U-turn, no parking, no trucks. The red circle-slash is prohibition grammar, the same on every sign that wears it."],
    ex: { code: "SHAPES SPEAK FIRST\noctagon → stop\ntriangle (point down) → yield\ndiamond → warning\npentagon → school zone / crossing\nround → railroad crossing ahead\nX (crossbuck) → the crossing itself\nrectangle → rules & directions",
          walk: ["Shape is readable from the back of the sign, in snow, at night.", "Color confirms the category: red stops, yellow warns, orange works.", "The two railroad shapes work as a team: circle warns, X guards.", "Rectangles are the librarians: limits, rules, distances, directions."] },
    mistake: "Reading a flashing yellow light as 'hurry through.' Flashing yellow means proceed with CAUTION — slow down and look. Flashing red is the one that means stop, exactly like a stop sign, before proceeding when clear." },
  { more: ["Cruise control and winter do not mix. Cruise holds a speed; it cannot feel the moment tires lose grip, and its automatic throttle can break traction on ice. In snow, your right foot — gentle, alert, and ready to lift — is the only cruise control the car should have.", "If your car does begin to skid, the old driver's chant still works: foot off the gas, eyes where you want to go, steer gently that way. Hard braking and big wheel movements feed a skid; calm ones end it."],
    ex: { code: "BAD-WEATHER SCRIPT\nRain hard → slow down, gap up, lights on\n~35 mph → hydroplaning can begin in heavy rain\nSnow/ice → double the 3-second gap\nBridges → freeze first; ease across\nFog → LOW beams (high beams bounce back)\nNight → stop within what your lights show",
          walk: ["Every line is a trigger and a response — decide them NOW, not at 55 mph.", "The hydroplane number surprises everyone: 35, not highway speed.", "Bridges freeze first because cold air flows under them too.", "Fog's low-beam rule runs opposite most people's instinct."] },
    mistake: "Scraping only a postcard-sized hole in a frosted windshield. The law and your safety both want the windshield and windows fully clear — ALL of them, plus lights, roof, and hood, so snow does not become someone else's blizzard behind you." },
  { more: ["Your record is a story other people can read: insurers set prices from it, employers check it for driving jobs, and the state totals it before renewals. A clean story is worth money every single month — careful driving literally pays.", "If your license is ever suspended, the reinstatement finish line has steps, not magic: serve the time, fix the cause, pay the fees, and file whatever proof (often insurance) the state asks for. Driving before the finish line restarts the race."],
    ex: { code: "FASTEST WAYS TO LOSE IT\n100+ mph → revoked, 6+ months\nDWI → revoked, plus criminal court\nLeaving a crash → crime, revocation\nRefusing the test → revocation\nNo insurance → penalties & loss\nDriving while suspended → more loss",
          walk: ["Notice the pattern: endangering others ends privileges fastest.", "Two entries involve paper, not driving — insurance and suspensions still count.", "Refusing the implied-consent test is its own revocation, separate from the DWI.", "Every road back starts with the same word: stop driving until reinstated."] },
    mistake: "Believing a first offense 'does not count.' Every conviction lands on the record — the first speeding ticket included. Records are cumulative, and consequences compound: small violations pile into big suspensions." },
  { more: ["Impairment math fools people at parties: a 12-ounce beer, a 5-ounce pour of wine, and a standard mixed drink each carry roughly the same alcohol — the glass shape changes, the dose does not. Mixed drinks can hide two doses in one glass, which is why 'I only had two drinks' can mean four.", "Prescription and over-the-counter medicines can impair as surely as alcohol — drowsiness warnings on a label are driving warnings. Mixing legal medicine with alcohol multiplies effects in ways nobody at the party can predict."],
    ex: { code: "ALCOHOL, HONESTLY\n1st drink → judgment already impaired\n0.08 → the legal line for adults (0.04 commercial)\nUnder 21 → Not a Drop: any alcohol is illegal\n~1 drink/hour → all the body can clear\nCoffee, air, exercise → do NOT sober anyone\nOnly time works.",
          walk: ["The line that matters is not 0.08 — impairment starts at drink one.", "0.08 is where the law presumes; crashes happen well below it.", "The clearing rate is fixed: about one standard drink per hour.", "Every folk remedy fails the same way: the liver sets the schedule."] },
    mistake: "Handing keys to 'the least drunk' friend. Least impaired is still impaired — the designated driver is the one who did not drink at all. Decide who that is before the first drink is poured." },
  { more: ["A smart final-week drill: read each Sandbox block aloud once, then answer ten practice questions from the Test tab. Numbers stick when they are used in decisions, not just recited — which is why the practice test randomizes: the real exam shuffles its questions too.", "On test morning: sleep, eat, bring your identification (and your Blue Card under 18), and arrive unhurried. One test per day is allowed, and the room is quiet for a reason — read every question twice. The test rewards careful readers as much as careful drivers."],
    ex: { code: "PASS = 32 OF 40 (80%)\n10/30/55 — alley, town, open road\n100 ft — signal early · bus yellows begin\n20 ft — stop from a flashing bus\n15–50 ft — stop from the rails\n3 sec — following gap (double on ice)\n0.08 — the line · 35 mph — hydroplane\n500 ft — if you can't see it, lights on",
          walk: ["This is the whole exam on one card — every number earned its place.", "Group by kind: speeds, distances, limits — grouped numbers memorize faster.", "Pair each number with its picture: the bus at 20 feet, the rails at 15 to 50.", "Say the card aloud once a day in test week. Then go pass."] },
    mistake: "Memorizing answers by question number or pattern ('the answer is always B'). The real test shuffles questions and options — as does Code Block's practice test. Learn the FACT and the letter cannot trick you." }
];

/* ---------- Drive shelves (2) ---------- */
var DRIVE_SHELVES = [
  { title: "The Sign Gallery", chapter: "Beyond the Manual · Drive shelf", num: "S1", color: "#2563eb", scene: 5,
    line: "Read the shape, then the color, then the words.",
    content: { story: ["Welcome to the gallery: every sign on Minnesota roads hangs in one of five rooms, organized by shape. Room one holds the octagon — alone, because stop is alone: eight sides, red, and no other sign may wear the shape. Room two, the point-down triangle of yield. Room three, the yellow diamond wall of warnings: curves, merges, slippery roads, deer, and crossings of every kind.", "Room four is the schoolhouse: the pentagon, shaped like a little house with a pointed roof, guards school zones and school crossings. Beside it hang the railroad pair — the round yellow advance-warning sign and the white X crossbuck at the tracks — and the orange room of work zones, where diamonds turn orange and the workers are real people, close to real traffic.", "The last room is rectangles: the rule-keepers. Speed limits, no-parking rules, lane-use arrows, and the green guide signs that carry distances and exits. Tour the gallery until the rooms feel like neighborhoods: shape first, color second, words last — exactly the order a driver reads them at speed."],
      big: "Five rooms: octagon (stop), triangle (yield), diamond (warning/work), pentagon (school), rectangles (rules and guides) — read shape, then color, then words.",
      caption: "The gallery tour: three doors become five rooms of signs. Tap Play to walk it.",
      demo: ["Room one: the lonely octagon. Stop lives here alone.", "Room two: the triangle. Yield, always ready to stop.", "Room three: yellow diamonds — warnings of every flavor.", "Room four: the pentagon schoolhouse and the railroad pair.", "Room five: rectangles, the rule-keepers. Gallery complete."] } },
  { title: "Test-Day Kit", chapter: "Beyond the Manual · Drive shelf", num: "S2", color: "#1d4ed8", scene: 24,
    line: "Bring ID, bring your card, bring a calm driver.",
    content: { story: ["A test is a performance, and performances go better with a kit. The knowledge-test kit: proper identification; if you are under 18, your Blue Card or Pink Card from driver education; and a brain that slept the night before. Remember the stakes are friendly — 80% passes, one test per day, and only after two failures does a $10 fee appear for the next try.", "The road-test kit adds the car itself: current registration, proof of insurance, and every required light, belt, and signal working — the examiner checks the vehicle before judging the driver. Arrive with a licensed driver, because until you pass, that is still the rule for how you travel.", "And the calm kit, the one nobody lists: eat breakfast, arrive early, read each question twice, and remember that the examiner — on either test — is not hunting for perfect. They are checking for SAFE. Safe is a style of driving you have been rehearsing since the first block."],
      big: "Knowledge kit: ID, Blue/Pink Card under 18, sleep. Road kit: registration, insurance, a vehicle that passes its own check. Calm kit: breakfast, early, read twice.",
      caption: "Words that travel with you on test day, pinned up where nerves can see them. Tap Play.",
      demo: ["ID in pocket. Blue Card beside it (under 18).", "Slept last night — the brain's own study session.", "Car checked: lights, belts, insurance card in the glove box.", "Breakfast eaten. Arrived early. Breathing slow.", "The kit is packed. All that is left is the test."] } }
];
var DRIVE_SHELFDEEP = [
  { more: ["Fluorescent yellow-green is the gallery's newest color: it appears on school-zone, pedestrian, and bicycle warning signs, chosen because the human eye spots it fastest in daylight. When a sign glows that electric green-yellow, vulnerable people are nearby — drop speed and raise attention.", "Guide signs use a language of their own: green for directions and distances, blue for motorist services (fuel, food, lodging, hospitals), and brown for recreation and parks. On the test, a sign's color alone usually narrows the answer to one family."],
    ex: { code: "COLOR GRAMMAR\nred → stop / do not / prohibited\nyellow → general warning\norange → work zone warning\nfluorescent yellow-green → school & people\nwhite → regulation (the rule itself)\ngreen → guide · blue → services · brown → recreation",
          walk: ["Colors sort signs into families before a single word is read.", "Red and white together mark the stop/yield family of commands.", "Orange is temporary: whatever it says outranks the usual signs while it stands.", "Green, blue, and brown never command — they inform. Commands wear red, white, or yellow."] },
    mistake: "Confusing the school CROSSING sign (pentagon, in the school zone) with the general pedestrian crossing sign (a yellow diamond with a walking figure). The pentagon shape is the schoolhouse — the test loves asking which shape guards schools." },
  { more: ["If nerves spike mid-test, use the driver's own tool: breathe out slowly, the way you ease onto a brake pedal. Then re-read the question for its VERB — what is it actually asking? Most missed questions are missed readings, not missed knowledge.", "After you pass, the kit's last item is a promise about the drive home: the provisional license's first months carry passenger and nighttime limits for teens in Minnesota. The license is the beginning of the rules, not the end of them."],
    ex: { code: "TEST MORNING\n□ Identification\n□ Blue/Pink Card (under 18)\n□ Glasses/contacts if you wear them\n□ A licensed driver to bring you\n□ Sleep □ Breakfast □ Time to spare\nRead every question twice. Answer the one asked.",
          walk: ["The checklist removes surprises; surprises are what nerves feed on.", "Glasses are the forgotten item — vision was screened for a reason.", "You cannot drive yourself to the road test. The licensed driver is part of the kit.", "Reading twice is a driving skill too: signs, like questions, punish skimmers."] },
    mistake: "Cramming new material in the parking lot. Last-hour facts shove older, stronger knowledge aside. The morning of the test, review ONLY the cram card from Chapter 9 — the numbers and shapes you already own." }
];

/* ---------- Drive glossary / field guide / cheat cards ---------- */
var DRIVE_GLOSSARY = [
  ["BAC", "Blood alcohol concentration — the measure of alcohol in the body. 0.08 is Minnesota's legal limit for adult drivers."],
  ["basic speed law", "The rule above all posted limits: never drive faster than is reasonable for the weather, traffic, and road."],
  ["blind spot", "The wedges beside the back of your car that mirrors cannot show you. Check them with a shoulder glance."],
  ["Blue Card", "The certificate of enrollment showing a Minnesota teen finished classroom driver education and enrolled in behind-the-wheel training."],
  ["controlled intersection", "An intersection with signs or signals telling drivers what to do."],
  ["crossbuck", "The X-shaped white sign standing AT a railroad crossing."],
  ["crosswalk", "The part of the road set aside for people walking — marked or unmarked, it carries right-of-way for pedestrians."],
  ["defensive driving", "Driving as if others might err: scanning ahead, keeping space, always having an escape plan."],
  ["designated driver", "The person in a group who agrees not to drink at all, and drives everyone home."],
  ["divided highway", "A road whose opposite directions are separated by a median or barrier."],
  ["DWI", "Driving while impaired — operating a vehicle under the influence of alcohol or drugs."],
  ["following distance", "The gap behind the vehicle ahead, measured by the three-second rule — doubled on snow and ice."],
  ["hands-free law", "Minnesota's law that a phone may be used while driving only by voice or one-touch activation."],
  ["hydroplaning", "Water lifting the tires off the pavement so steering and braking fade — it can begin near 35 mph in heavy rain."],
  ["implied consent", "By driving in Minnesota you agree to a chemical test if arrested for DWI; refusing brings revocation."],
  ["instruction permit", "The learner's credential: drive only with a licensed driver beside you, while you practice for the license."],
  ["knowledge test", "The written permit test — multiple choice and true/false about laws and signs; 80% passes."],
  ["move over law", "Change lanes away from a stopped emergency vehicle with flashing lights, or slow down if you cannot."],
  ["No-Zone", "A large truck's blind spots — beside, behind, and in front — where the driver cannot see a car."],
  ["Not a Drop", "Minnesota's law that drivers under 21 may not drive with any detectable alcohol."],
  ["provisional license", "The first real license for teen drivers, with passenger and nighttime limits in its first months."],
  ["revocation", "The state taking a license away entirely for a period, after which you must re-apply."],
  ["right-of-way", "Who goes first by law. It is something you yield — give — to others, never something you take."],
  ["road test", "The driving exam: a vehicle equipment check, then real driving judged for safety and control."],
  ["roundabout", "A circular intersection where traffic moves one way around a center island, yielding on entry."],
  ["school zone", "A signed stretch near a school where speeds drop and watchfulness rises when children are present."],
  ["shoulder glance", "The quick look over your shoulder into the blind spot before a lane change."],
  ["stop arm", "The stop sign that swings out from a school bus's side; when it is out with red lights flashing, you stop."],
  ["suspension", "A temporary withdrawal of driving privileges for a set period."],
  ["three-second rule", "The following-distance count: pass a fixed point at least three seconds after the car ahead did."],
  ["uncontrolled intersection", "An intersection with no signs or signals, where the driver on the left yields to the driver on the right."],
  ["vision screening", "The eyesight check for a permit or license: at least 20/40 vision and 105 degrees of peripheral vision."],
  ["work zone", "A construction area signed in orange, with lower speeds, workers present, and extra penalties."],
  ["yield", "Slow down — and stop if needed — to let others go first."]
];
var DRIVE_FIELD = [
  { name: "Turn signals", head: "Required equipment", what: "Your voice on the road. Signal at least 100 feet before every turn or lane change, and make sure both bulbs actually blink — a fast blink usually means one has burned out.", ex: "signal on → 100 ft → turn" },
  { name: "High and low beams", head: "Headlights", what: "Headlights on at sunset until sunrise, and in any weather that cuts your view below 500 feet. Dim high beams within 1,000 feet of oncoming traffic and within 200 feet behind another car.", ex: "sunset → lights on → dim for others" },
  { name: "Tire tread", head: "Tires", what: "Tread channels water away and grips ice and pavement. Worn tires stretch every stop and open the door to hydroplaning — check tread and pressure before the season tests them.", ex: "good tread → grip → shorter stops" },
  { name: "Brake lights", head: "Required equipment", what: "The message every driver behind you depends on. Have a friend watch while you press the pedal — all brake lights should answer, including the high center one.", ex: "pedal pressed → all brake lights glow" },
  { name: "Mirrors", head: "Before you drive", what: "Rear-view plus both side mirrors, adjusted after the seat and before moving. Mirrors cover most of the rear world — the blind spots are what the shoulder glance is for.", ex: "seat → mirrors → belt → drive" },
  { name: "Seatbelts", head: "Required for everyone", what: "Every occupant, every seat, every trip. Children under 9 — or under 4 feet 9 inches — ride in a booster or child seat in back, where kids are safest.", ex: "click it → every seat → every trip" },
  { name: "Hazard lights", head: "Four-way flashers", what: "Both turn signals at once: 'I am stopped or moving slowly — be careful around me.' Use them after a crash, in a breakdown, or crawling in a sudden storm.", ex: "trouble → hazards on → others warned" },
  { name: "The horn", head: "Required equipment", what: "A short warning, not a shout. One tap to alert a drifting driver or a pedestrian who has not seen you — and never as punishment.", ex: "danger you can't avoid → tap, don't blast" },
  { name: "Washer fluid & wipers", head: "Winter kit", what: "Minnesota slush can blind a windshield in a mile. Full winter washer fluid and healthy wiper blades are safety equipment, not comforts.", ex: "slush hits → washer + wipers → clear view" },
  { name: "Parking brake", head: "Every hill, every park", what: "Set it whenever you park, hills especially, and turn the wheels to use the curb as a second brake: downhill toward the curb, uphill away from it.", ex: "park → brake on → wheels to curb plan" }
];
var DRIVE_CHEATS = [
  { title: "Speed Numbers Card", body: "The defaults under ideal conditions — signs always override.", code: "alley → 10 mph\ntown & urban → 30 mph\neverywhere else → 55 mph\npassing on 2-lane 55+ → +10, only while passing" },
  { title: "Distance Numbers Card", body: "The gaps that keep people alive, on one card.", code: "signal → 100 ft before the turn\nschool bus → stop 20 ft away\nfire hydrant → park 10+ ft away\ncrosswalk → park 20+ ft away\nrailroad rail → park 50+ ft away · stop 15–50 ft\nbicycles → pass with 3+ ft" },
  { title: "Shapes Card", body: "Read the shape before the words.", code: "octagon → STOP\ntriangle (point down) → YIELD\ndiamond → WARNING\npentagon → SCHOOL\nround → RAILROAD AHEAD\nX crossbuck → AT THE TRACKS\nrectangle → RULES & GUIDES" },
  { title: "Lights Card", body: "What the signals are telling you.", code: "steady red → stop (right turn after stop, if allowed)\nsteady yellow → prepare to stop\nsteady green → go, watching the intersection\ngreen arrow → protected turn that way\nflashing red → treat as a stop sign\nflashing yellow → proceed with caution" },
  { title: "Winter Card", body: "Minnesota's home-field chapter.", code: "gap → double the 3 seconds\nbridges → freeze first\ngentle → gas, brake, steering all soft\ncruise control → OFF\nwindows → ALL scraped clear\nnever outdrive → your headlights" },
  { title: "Test Day Card", body: "What the examiner is really grading.", code: "knowledge → 80% passes (32 of 40)\nvision → 20/40 · 105° peripheral\nbring → ID (+ Blue/Pink Card under 18)\none test per day · 3rd try after 2 fails = $10\nread each question twice" }
];

/* ---------- Drive Vault: sign & number drill templates ---------- */
var DRIVE_SHAPE_PAIRS = [["red octagon", "STOP"], ["upside-down triangle", "YIELD"], ["yellow diamond", "WARNING"], ["pentagon", "SCHOOL ZONE"], ["round sign", "RAILROAD CROSSING AHEAD"]];
var DRIVE_NAMES = ["Maya", "Leo", "Ana", "Sam", "June", "Noah", "Ivy", "Omar", "Ruth", "Eli", "Nina", "Cole", "Fern", "Hugo", "Lena", "Ezra"];
var DRIVE_PLACES = ["in Duluth", "in Minneapolis", "in Rochester", "in St. Paul", "on a county road", "in a school zone", "downtown", "on the freeway", "in a work zone", "near the lake"];
var cbDrivePair = 0;
/* Fill helper the Vault generator calls in Drive mode (wired in index.html).
   Shapes and meanings are index-paired, so every generated drill is TRUE. */
window.cbDriveFill = function (k, r) {
  function pick(b) { return b[Math.floor(r() * b.length)]; }
  switch (k) {
    case "shape": cbDrivePair = Math.floor(r() * DRIVE_SHAPE_PAIRS.length); return DRIVE_SHAPE_PAIRS[cbDrivePair][0];
    case "meaning": return DRIVE_SHAPE_PAIRS[cbDrivePair][1];
    case "dname": return pick(DRIVE_NAMES);
    case "place": return pick(DRIVE_PLACES);
    case "alley": return "10";
    case "urban": return "30";
    case "open": return "55";
    case "signal": return "100";
    case "bus": return "20";
    case "bac": return "0.08";
    case "hydro": return "35";
    case "gap": return "3";
    case "gap2": return "6";
    case "see": return "500";
    case "hyd": return "10";
    case "bike": return "3";
  }
  return null;
};
var DRIVE_VT = [
  { line: "{dname} sees a {shape} sign: {meaning}.", why: "Shape first, meaning instantly — that is how drivers read signs at speed." },
  { line: "{dname} creeps through the alley at {alley} mph.", why: "Alleys are walking-pace places: the limit is 10 mph." },
  { line: "{dname} drives in town at {urban} mph or less.", why: "On urban and town roads, the unsigned default limit is 30 mph." },
  { line: "On the open road, {dname} may drive {open} mph.", why: "Where no sign says otherwise, Minnesota's default limit is 55 mph." },
  { line: "{dname} signals {signal} feet before the turn.", why: "100 feet of warning — the law, and simple courtesy with a number." },
  { line: "{dname} stops {bus} feet from the flashing school bus.", why: "20 feet leaves room for children to cross in front of the bus." },
  { line: "{dname} knows a BAC of {bac} or higher is illegal.", why: "0.08 is the legal line for adult drivers — and impairment starts at drink one." },
  { line: "At {hydro} mph in heavy rain, {dname} can hydroplane.", why: "35 mph surprises everyone: water can lift tires at city speeds." },
  { line: "{dname} counts {gap} seconds of following space.", why: "The three-second rule turns reaction time into a gap you can count." },
  { line: "If {dname} cannot see {see} feet ahead, the headlights go on.", why: "500 feet of visibility is the lights-on trigger, day or night." },
  { line: "{dname} parks {hyd} feet from the hydrant.", why: "Fire hydrants need their space: never park within 10 feet of one." },
  { line: "On ice, {dname} doubles the gap to {gap2} seconds.", why: "Snow and ice stretch stopping distances — the three-second gap becomes six." },
  { line: "{dname} yields to the car on the right {place}.", why: "At uncontrolled intersections, the driver on the left yields to the driver on the right." },
  { line: "Passing a bike, {dname} leaves {bike} feet of space.", why: "Three feet is the legal minimum when passing a bicycle — more is welcome." }
];
var DRIVE_THEMES = [
  { name: "Sign Shapes", t: [0, 12, 0, 4, 12] },
  { name: "Speed Numbers", t: [1, 2, 3, 0, 12] },
  { name: "Signal & Stop Distances", t: [4, 5, 10, 0, 12] },
  { name: "Limits & Lines", t: [6, 8, 11, 0, 12] },
  { name: "Rain, Ice & Night", t: [7, 9, 11, 0, 12] },
  { name: "City Driving", t: [2, 4, 10, 0, 12] },
  { name: "Open Road", t: [3, 8, 9, 0, 12] },
  { name: "School & Safety", t: [5, 13, 4, 0, 12] },
  { name: "Parking Rules", t: [10, 5, 11, 0, 12] },
  { name: "Sharing the Road", t: [12, 13, 8, 0, 5] },
  { name: "Warning Signs", t: [0, 0, 12, 7, 9] },
  { name: "Night Driving", t: [9, 11, 8, 0, 12] },
  { name: "Winter Roads", t: [11, 7, 8, 0, 12] },
  { name: "Test Numbers", t: [1, 6, 9, 0, 12] },
  { name: "Right of Way", t: [12, 12, 13, 0, 4] },
  { name: "Bus & Bike", t: [5, 13, 13, 0, 12] },
  { name: "Distances", t: [4, 10, 5, 0, 12] },
  { name: "Weather Watch", t: [7, 11, 9, 0, 12] },
  { name: "Rules of the Road", t: [6, 3, 2, 0, 12] },
  { name: "Final Review", t: [0, 12, 6, 9, 11] }
];

/* ---------- Permit practice test: 106 original questions from manual facts ---------- */
var DRIVE_QUIZ = [
  { q: "What does a red octagon sign mean?", o: ["Yield", "Stop", "Do not enter", "School zone"], a: 1, why: "The octagon is reserved for STOP alone — eight sides, red, unmistakable even from behind." },
  { q: "An upside-down triangle sign means:", o: ["Stop", "Warning", "Yield", "No passing"], a: 2, why: "The point-down triangle is the yield sign: slow down and let others go first." },
  { q: "A yellow diamond-shaped sign tells you:", o: ["A rule you must obey", "A warning of conditions ahead", "Directions and distances", "Services like food and fuel"], a: 1, why: "Diamond shape + yellow = warning: a curve, merge, slippery road, or crossing ahead." },
  { q: "Which shape marks a school zone or school crossing?", o: ["Diamond", "Rectangle", "Pentagon", "Circle"], a: 2, why: "The pentagon — shaped like a little house — guards school zones and crossings." },
  { q: "A round yellow sign warns of:", o: ["A school ahead", "A railroad crossing ahead", "A work zone ahead", "A sharp curve ahead"], a: 1, why: "The round sign is the railroad advance warning; the X-shaped crossbuck stands at the tracks themselves." },
  { q: "Orange signs and barriers mean:", o: ["Recreation area", "A detour route meant for trucks and buses only", "Construction or work zone — slow down", "Tourist information"], a: 2, why: "Orange is the work-zone color: slow down, expect workers and changed road conditions." },
  { q: "Green signs are used for:", o: ["Warnings", "Rules and laws that all drivers on the road must obey", "Guide information — directions and distances", "Prohibitions"], a: 2, why: "Green guides: exits, distances, and directions. Blue points to services; brown to parks and recreation." },
  { q: "A white rectangular sign usually shows:", o: ["A warning", "A regulation, like the speed limit", "A recreation area or a scenic overlook nearby", "A railroad crossing"], a: 1, why: "White rectangles carry the rules — speed limits and other regulations." },
  { q: "A sign with a red circle and a slash over a picture means:", o: ["The pictured action is encouraged", "The pictured action is prohibited", "The pictured service is ahead", "Caution — the pictured thing is near"], a: 1, why: "The red circle-slash is prohibition grammar: no U-turn, no parking, no trucks — whatever is pictured is banned." },
  { q: "The X-shaped crossbuck is found:", o: ["A mile before a railroad crossing", "Only on freeways", "At the railroad crossing itself", "At school crossings"], a: 2, why: "The crossbuck stands AT the tracks; the round yellow sign warns you earlier." },
  { q: "A fluorescent yellow-green sign most likely concerns:", o: ["A work zone", "Schools, pedestrians, or bicycles nearby", "Freeway exit ramps and highway interchanges", "A rest area"], a: 1, why: "That electric color is reserved for places where vulnerable people — students, walkers, riders — are nearby." },
  { q: "A pennant-shaped sign (a sideways triangle flag) on the left side of a road means:", o: ["Yield ahead", "School zone", "No passing zone", "Merge ahead"], a: 2, why: "The pennant marks a no-passing zone on two-lane roads." },
  { q: "Blue signs point to:", o: ["Parks", "Services — fuel, food, lodging, hospitals", "Warnings", "Speed limits and other rules drivers must follow"], a: 1, why: "Blue serves the traveler: gas, food, lodging, and hospitals." },
  { q: "Brown signs point to:", o: ["Construction", "Schools", "Parks and recreation areas", "Truck routes"], a: 2, why: "Brown is recreation: parks, campgrounds, and points of outdoor interest." },
  { q: "A solid yellow line on YOUR side of the center line means:", o: ["Passing is allowed", "Do not pass", "The road is one-way", "A school zone is ahead"], a: 1, why: "Solid yellow on your side = no passing. Broken yellow = passing allowed when safe." },
  { q: "A broken white line between lanes means:", o: ["Never change lanes", "Lanes go opposite directions", "You may change lanes when it is safe", "A railroad crossing is ahead"], a: 2, why: "Broken white separates same-direction lanes you may cross; solid white says stay in your lane." },
  { q: "Two solid yellow lines in the center mean:", o: ["Passing allowed both ways", "Passing allowed one way", "No passing from either direction", "The road ends ahead"], a: 2, why: "Double solid yellow: nobody passes, from either side." },
  { q: "The solid white line at the right edge of the road marks:", o: ["A bike lane only", "The edge of the travel lane", "Where parking begins", "The stop line"], a: 1, why: "The edge line (fog line) marks the boundary of the travel lane — in fog it helps you stay on the road." },
  { q: "Minnesota's speed limit in an alley, unless signed otherwise, is:", o: ["10 mph", "15 mph", "20 mph", "30 mph"], a: 0, why: "10 mph in alleys — barely above walking pace, because alleys hide children, pets, and backing cars." },
  { q: "The speed limit on urban or town roads, unless signed otherwise, is:", o: ["25 mph", "30 mph", "35 mph", "45 mph"], a: 1, why: "30 mph on urban and town roads; 55 mph in other locations; 10 mph in alleys." },
  { q: "Where no sign gives a limit, Minnesota's default speed limit is:", o: ["45 mph", "50 mph", "55 mph", "70 mph"], a: 2, why: "55 mph in all other locations not specified — under ideal conditions." },
  { q: "Minnesota's basic speed law requires you to:", o: ["Always drive exactly the posted limit", "Drive no faster than is reasonable for conditions", "Drive 5 mph under the limit at all times", "Match the speed of traffic, whatever it is"], a: 1, why: "The basic law outranks the posted number: ice, fog, or traffic can make the posted limit illegally fast." },
  { q: "On a two-lane highway posted 55 mph or higher, the limit while lawfully passing is:", o: ["Unchanged — never exceed the limit", "Increased by 10 mph during the pass", "Increased by 15 mph during the pass", "Whatever speed completes the pass"], a: 1, why: "Minnesota raises the limit by 10 mph on 55+ two-lane highways only while you are lawfully passing." },
  { q: "Driving more than 100 mph in Minnesota results in:", o: ["A warning letter", "A doubled fine only", "License revocation for at least six months", "A required safety class only"], a: 2, why: "Over 100 mph: revocation for a minimum of six months — one of the fastest ways to lose a license." },
  { q: "Additional speeding fines begin when you are caught driving:", o: ["5 mph over the limit", "10 mph over the limit", "20 mph or more over the limit", "Only above 100 mph"], a: 2, why: "Extra fines are charged at 20 mph or more over the posted limit." },
  { q: "In a school zone, you must:", o: ["Keep driving at the normal posted speed limit", "Reduce speed when children are present", "Stop at every corner", "Use high beams"], a: 1, why: "Reduce speed in school zones when children are present, and always obey the posted school-zone limit." },
  { q: "In a work zone with no special postings, you should:", o: ["Speed up to clear it quickly", "Ignore the normal limit", "Obey the posted limit and drive with care", "Stop before entering"], a: 2, why: "Obey the posted limit in work zones; violations there bring extra penalties, and workers stand close to traffic." },
  { q: "It is illegal to drive slower than a posted minimum speed:", o: ["Never — driving slowly is always legal at any speed", "Under normal weather, traffic, and road conditions", "Only on freeways", "Only at night"], a: 1, why: "Minimum limits exist so traffic can flow; under normal conditions, driving below the minimum is illegal." },
  { q: "A steady yellow traffic light means:", o: ["Speed up to beat the red", "The light is about to turn red — stop if you safely can", "Yield signs are ahead", "The intersection is uncontrolled, so treat it as a four-way stop"], a: 1, why: "Steady yellow warns the red is coming: stop if you can do so safely; go through only if stopping is unsafe." },
  { q: "A flashing red light means:", o: ["Proceed with caution", "Stop — the same as a stop sign — then go when clear", "The signal is broken, so ignore it and drive through", "Yield to the right only"], a: 1, why: "Flashing red = stop sign behavior: full stop, then proceed when the way is clear." },
  { q: "A flashing yellow light means:", o: ["Stop completely", "Road closed", "Proceed with caution", "A train is coming"], a: 2, why: "Flashing yellow asks for caution, not a stop: slow down and look carefully." },
  { q: "A green arrow showing with a red light means:", o: ["Stop — red always wins", "You may go in the direction of the arrow", "Turn only in an emergency", "The signal is malfunctioning"], a: 1, why: "A green arrow protects that movement: you may go the way the arrow points even while the light is red." },
  { q: "At a red light, a right turn is allowed:", o: ["Never", "Only with a green arrow", "After a complete stop, unless a sign prohibits it", "Without stopping if the road looks empty"], a: 2, why: "Stop first, check for a NO TURN ON RED sign, yield to everyone — then you may turn right on red." },
  { q: "When a traffic light turns green, you should:", o: ["Go instantly — your right-of-way is absolute", "Look both ways for late cross-traffic, then go", "Honk before entering", "Wait for the car behind to move first"], a: 1, why: "A green light is permission, not protection. A quick look catches red-light runners." },
  { q: "If all traffic signals at an intersection are dark (power out), treat it as:", o: ["An uncontrolled intersection — proceed freely", "A four-way stop", "A yield in all directions — roll through slowly", "Closed — turn around"], a: 1, why: "Dark signals become an all-way stop: every driver stops, and the first to arrive goes first." },
  { q: "A green arrow ends and a green ball remains for your turn lane. You may turn:", o: ["Freely — green is green", "After yielding to oncoming traffic and pedestrians", "Only after every car in the oncoming lane has fully stopped", "Never without an arrow"], a: 1, why: "Once the arrow ends, the turn is unprotected: oncoming traffic has the right-of-way until you find a safe gap." },
  { q: "Two drivers reach an uncontrolled intersection at the same time. Who goes first?", o: ["The driver on the left", "The driver on the right", "The faster driver", "The driver going straight on the bigger road"], a: 1, why: "At uncontrolled intersections, the driver on the LEFT yields to the driver on the RIGHT." },
  { q: "At a four-way stop, the first vehicle to go is:", o: ["The largest vehicle", "The one that arrived and stopped first", "The one turning left", "The one on the widest street"], a: 1, why: "First to stop, first to go. Ties go to the driver on the right; left-turners yield to oncoming traffic." },
  { q: "You are turning left at an intersection. You must yield to:", o: ["Nobody — drivers who are turning always have priority", "Only trucks", "Oncoming traffic and pedestrians in the crosswalk", "Only vehicles behind you"], a: 2, why: "Left turns cross two worlds: oncoming cars going straight, and people in the crosswalk. Yield to both." },
  { q: "A pedestrian with a white cane or a guide dog is at a crosswalk. You must:", o: ["Honk so they know you are there", "Always yield — stop and wait", "Pass slowly behind them", "Wave them across quickly"], a: 1, why: "A white cane or guide dog signals a blind pedestrian: always yield, stop, and never block the crosswalk." },
  { q: "Who has the right-of-way in a marked or unmarked crosswalk?", o: ["The faster vehicle", "The pedestrian", "Bicycles only", "Whoever arrives with more speed"], a: 1, why: "People on foot hold the right-of-way in crosswalks — marked or unmarked — and drivers must stop for them." },
  { q: "An emergency vehicle with lights and siren approaches from behind. You should:", o: ["Speed up to stay ahead", "Stop right where you are, in your lane", "Pull to the right edge and stop until it passes", "Turn left off the road"], a: 2, why: "Pull right and stop; stay stopped until the emergency vehicle has passed. Never block an intersection." },
  { q: "You approach a roundabout. You must:", o: ["Stop completely, always", "Yield to traffic already in the circle", "Enter quickly before others", "Yield only to trucks"], a: 1, why: "Slow down, yield to traffic in the roundabout, then enter and travel around the island in the proper direction." },
  { q: "Another driver insists on taking right-of-way that is legally yours. The safe choice is:", o: ["Take it — the law is on your side, so it is the other driver's problem", "Give it up — right-of-way is yielded, never taken by force", "Race them through", "Block their path to teach the rule"], a: 1, why: "Right-of-way rules prevent crashes only when drivers yield. A crash never proves a point worth making." },
  { q: "A car ahead of you is stopped at a crosswalk with no light. You should:", o: ["Pass it on the left", "Pass it on the right, slowly, once you have honked twice", "Stop too — a pedestrian may be hidden in front of it", "Honk until it moves"], a: 2, why: "Never pass a vehicle stopped at a crosswalk: it is often shielding a person you cannot see." },
  { q: "When entering a freeway from an on-ramp, who has the right-of-way?", o: ["The entering driver", "Traffic already on the freeway", "Whoever is faster", "Large trucks only"], a: 1, why: "Freeway traffic keeps the right-of-way; merging drivers adjust speed and find a gap." },
  { q: "A funeral procession with headlights on is crossing. You should:", o: ["Cut through a gap", "Yield and not disrupt the procession", "Pass it on the shoulder", "Join the end of it"], a: 1, why: "Yield to the procession, do not cut through it, and do not pass it on a two-lane road." },
  { q: "You may NOT park within how many feet of a fire hydrant?", o: ["5 feet", "10 feet", "15 feet", "25 feet"], a: 1, why: "Keep 10 feet clear around hydrants — firefighters need the space on their worst day, not your best." },
  { q: "Parking is prohibited within how many feet of a crosswalk at an intersection?", o: ["10 feet", "15 feet", "20 feet", "50 feet"], a: 2, why: "20 feet from a crosswalk keeps sight lines open for people stepping off the curb." },
  { q: "You may not park within how many feet of the nearest rail of a railroad crossing?", o: ["15 feet", "20 feet", "30 feet", "50 feet"], a: 3, why: "Keep 50 feet from the nearest rail when parking near a crossing." },
  { q: "Facing downhill at a curb, turn your wheels:", o: ["Away from the curb", "Toward the curb", "Straight ahead", "It does not matter"], a: 1, why: "Downhill: wheels toward the curb, so a rolling car is caught by it. Uphill with a curb: wheels away." },
  { q: "Facing uphill where there is a curb, turn your wheels:", o: ["Toward the curb", "Away from the curb", "Straight ahead", "Toward the center line"], a: 1, why: "Uphill with a curb, turned-away wheels let a rolling car swing back and wedge against the curb." },
  { q: "Every time you park on a hill, you should also:", o: ["Leave the engine running", "Set the parking brake", "Leave the car in neutral with an automatic", "Turn on hazard lights"], a: 1, why: "Wheels plan for a roll; the parking brake prevents it. Use both, every hill." }
];

DRIVE_QUIZ.push(
  { q: "The three-second rule helps you judge:", o: ["Your speed", "A safe following distance", "When to change lanes", "Your stopping distance on ice only"], a: 1, why: "Count three seconds between the car ahead passing a fixed point and you reaching it. Less than three — back off." },
  { q: "On snow or ice, your three-second following gap should become:", o: ["The same — three seconds always", "Shorter, to keep up with traffic", "Doubled — six seconds or more", "Zero — stay close to the leader's tracks"], a: 2, why: "Snow and ice stretch stopping distances many times over. Double the gap — or more." },
  { q: "Before changing lanes, the correct order is:", o: ["Glance over your shoulder first, signal, and then move over", "Signal, check mirrors, glance over your shoulder", "Move, then signal", "Honk, glance, move"], a: 1, why: "Signal, mirrors, shoulder: announce, survey, then verify the blind spot with your own eyes." },
  { q: "Your blind spots are located:", o: ["Directly in front of the hood", "Beside the rear corners of your car, outside mirror view", "Only on the driver's side of the car, never the passenger side", "Above the roof"], a: 1, why: "Mirrors miss the wedges beside your rear corners. Only a shoulder glance clears them." },
  { q: "You must signal at least how far before a turn?", o: ["50 feet", "100 feet", "200 feet", "500 feet"], a: 1, why: "At least 100 feet before turning — and keep signaling through the turn." },
  { q: "When following a motorcycle, your following distance should be:", o: ["Half of a car's", "The same as following a car, or greater", "As close as safely possible", "Motorcycles must yield their gap"], a: 1, why: "Same or greater than for a car — riders can stop and swerve quickly, and they have no steel shell." },
  { q: "A large truck's blind spots (No-Zones) are:", o: ["Only behind the trailer and nowhere along the sides", "Small, like a car's", "Along both sides, behind, and directly in front", "Only on the right side"], a: 2, why: "If you cannot see the truck driver's mirrors, the driver cannot see you. The No-Zones are huge." },
  { q: "The safest way to check that a truck driver can see you is:", o: ["Flash your headlights", "Check whether you can see the driver in the truck's mirrors", "Drive very close behind the trailer so the driver notices you there", "Honk twice"], a: 1, why: "See the mirrors, see the driver: if their mirrors are invisible to you, your car is invisible to them." },
  { q: "A school bus flashes YELLOW lights. That means:", o: ["The bus is about to stop — prepare to stop", "Pass quickly on the left", "The bus is broken down", "It means children may not be riding on the bus"], a: 0, why: "Yellow bus lights arm the warning: the bus will stop soon. They begin 100 or 300 feet before the stop, by speed zone." },
  { q: "A school bus is stopped with red lights flashing and its stop arm out. You must stop at least:", o: ["5 feet away", "10 feet away", "20 feet away", "Only if children are visible"], a: 2, why: "Stop at least 20 feet from the bus and stay stopped until the arm retracts and the reds go out." },
  { q: "You are on the OPPOSITE side of a separated roadway from a stopped school bus with reds flashing. You:", o: ["Must always stop", "Are not required to stop", "Must stop only in school zones", "Must honk before passing"], a: 1, why: "A separated roadway (median or barrier) is the one exception: traffic on the other side need not stop." },
  { q: "Breaking the school-bus stop-arm law brings at least:", o: ["A verbal warning", "A fine of not less than $300 and possible suspension", "A $25 fine", "Community service hours only, with no fine and no suspension"], a: 1, why: "A fine of not less than $300 plus suspension of driving privileges — Minnesota guards school buses seriously." },
  { q: "The minimum space to leave when passing a bicycle is:", o: ["1 foot", "2 feet", "3 feet", "A full lane in all cases"], a: 2, why: "At least three feet between your car and the rider — and more is always welcome." },
  { q: "A stopped tow truck has its lights flashing ahead of you. The Move Over law says:", o: ["Maintain speed and lane", "Move to the lane farthest from it if safe, or slow down", "Stop completely behind it and stay there until it drives away", "Pass on the shoulder"], a: 1, why: "Move over law covers tow trucks and emergency vehicles: change lanes away if you safely can; otherwise slow down." },
  { q: "At a railroad crossing with flashing lights, stop between:", o: ["5 and 10 feet from the rail", "15 and 50 feet from the nearest rail", "50 and 100 feet from the rail", "Right at the rail"], a: 1, why: "Stop 15 to 50 feet from the nearest rail — close enough to see, far enough to be safe." },
  { q: "The most important railroad-crossing habit is:", o: ["Race the train across whenever it still looks far away", "Look for trains in both directions at every crossing", "Stop on the tracks to check", "Shift gears while crossing"], a: 1, why: "Look both ways at EVERY crossing, devices or not — and after one train passes, check for a second." },
  { q: "If your vehicle stalls on railroad tracks, you should:", o: ["Stay inside and keep trying to start it", "Get everyone out and move away from the tracks", "Push it while traffic waits", "Flag down the train"], a: 1, why: "People first: get out, move away from the tracks, then get help. A car can be replaced; the train cannot stop." },
  { q: "Some vehicles — like school buses and hazardous-material trucks — at railroad crossings must:", o: ["Speed up", "Stop at all crossings, train or no train", "Sound the horn", "Use the shoulder and pass the crossing quickly"], a: 1, why: "Certain vehicles must stop at all railroad tracks whether or not a train is present. Never pass one there." },
  { q: "Hydroplaning can begin at speeds as low as:", o: ["20 mph", "35 mph in heavy rain", "55 mph", "70 mph"], a: 1, why: "In heavy rain on worn tires, hydroplaning can start around 35 mph — well below highway speed." },
  { q: "If your car starts to hydroplane, you should:", o: ["Brake hard", "Turn the wheel sharply", "Ease your foot off the gas and slow gently", "Accelerate firmly to push through and regain grip"], a: 2, why: "Ease off the gas, steer straight and gently. Hard braking or sharp steering can spin a floating car." },
  { q: "In fog, you should use:", o: ["High beams — more light is better", "Low beams — high beams reflect back at you", "Parking lights only", "No lights, to see others better"], a: 1, why: "Fog bounces high beams back into your eyes. Low beams, slower speed, bigger gap." },
  { q: "Headlights must be turned on:", o: ["Only after dark downtown", "At sunset, and used until sunrise", "Only in rain", "Only on freeways"], a: 1, why: "Sunset to sunrise — plus rain, snow, hail, sleet, fog, and any time you cannot clearly see 500 feet ahead." },
  { q: "Dim your high beams when an oncoming vehicle is within:", o: ["200 feet", "350 feet", "500 feet", "1,000 feet"], a: 3, why: "Within 1,000 feet of oncoming traffic — and within 200 feet when following another vehicle — low beams are required." },
  { q: "'Overdriving your headlights' means:", o: ["Using high beams in the city", "Driving too fast to stop within the distance your headlights illuminate", "Leaving your headlights switched on long after sunrise on a clear, bright day", "Aiming headlights too high"], a: 1, why: "High beams light roughly 350 feet. If you could not stop inside the light you can see, slow down." },
  { q: "Bridge decks are dangerous in winter because:", o: ["They are always wet", "They freeze before the surrounding road does", "They have lower speed limits than the roads around them", "Trucks avoid them"], a: 1, why: "Cold air flows under a bridge as well as over it, so its deck ices first — ease across, no sudden moves." },
  { q: "If your car starts to skid on ice, you should:", o: ["Brake as hard as possible", "Turn the steering wheel hard in the opposite direction", "Ease off the gas and steer gently where you want to go", "Use cruise control to hold speed"], a: 2, why: "Foot off the gas, eyes up, steer gently toward where you want to go. Violence feeds a skid; calm ends it." },
  { q: "Cruise control on snowy or icy roads is:", o: ["Recommended — it holds a steady speed", "A bad idea — it cannot feel the tires lose grip", "Required above 40 mph", "Only a problem downhill"], a: 1, why: "Leave cruise off in winter. Your lifting foot is the traction sensor no cruise system has." },
  { q: "Before driving in winter, the law and safety both want:", o: ["Only a small peephole scraped in the windshield", "Windshield and all windows fully clear of snow and ice", "Headlights cleaned only", "Snow left on the roof is fine"], a: 1, why: "Clear every window, the lights, and the roof — your view out, and nobody else's blizzard behind you." },
  { q: "It is illegal for an adult driver to drive with a BAC of:", o: ["0.02 or higher", "0.05 or higher", "0.08 or higher", "0.10 or higher"], a: 2, why: "0.08 is Minnesota's per-se limit for adults — 0.04 for commercial drivers." },
  { q: "For drivers under 21, Minnesota's Not-a-Drop law means:", o: ["One drink is allowed", "Any detectable alcohol makes driving illegal", "The limit is 0.05", "Only hard liquor counts toward it, never beer or wine"], a: 1, why: "Not a Drop: under 21, driving with ANY alcohol in your system is illegal." },
  { q: "Driving ability begins to be impaired:", o: ["Only at 0.08 BAC", "After the first drink", "After three drinks", "Only on an empty stomach"], a: 1, why: "Judgment — the first skill driving needs — is impaired by the very first drink, long before it feels like it." },
  { q: "The only thing that lowers a person's BAC is:", o: ["Coffee", "Fresh air and exercise", "A cold shower", "Time"], a: 3, why: "The liver clears about one drink per hour. Coffee makes a wide-awake drunk, not a sober driver." },
  { q: "Which contains roughly the most alcohol?", o: ["A 12-ounce beer", "A 5-ounce glass of wine", "A typical mixed drink", "All three carry about the same amount"], a: 3, why: "Beer, wine, and a standard mixed drink each carry about the same alcohol — the glass changes, the dose does not." },
  { q: "Minnesota's implied consent law means:", o: ["Parents consent to a teen's license", "Driving implies agreement to a chemical test if arrested for DWI", "Passengers automatically consent to whatever the driver decides to do", "Insurance is automatic"], a: 1, why: "By driving, you consent to testing after a DWI arrest. Refusing brings revocation of its own." },
  { q: "Prescription and over-the-counter medicines:", o: ["Can never impair driving", "Can impair driving, especially mixed with alcohol", "Are legal, so they are always completely safe to drive on", "Only matter for truck drivers"], a: 1, why: "Legal drugs impair too — drowsiness warnings on a label are driving warnings, and alcohol multiplies them." },
  { q: "The safest plan before drinking is to:", o: ["Decide you will 'see how you feel later'", "Arrange a designated driver, taxi, or ride in advance", "Eat a large meal and drive slowly", "Drink only beer"], a: 1, why: "Alcohol attacks judgment first — so the ride decision must be made sober, before the first drink." },
  { q: "A designated driver is someone who:", o: ["Drank the least in the group", "Did not drink at all", "Drank only early in the evening", "Drives the slowest"], a: 1, why: "Least-drunk is still impaired. The designated driver is the one who did not drink — chosen in advance." },
  { q: "The minimum age to apply for a Minnesota instruction permit is:", o: ["14", "15", "16", "18"], a: 1, why: "15 years old, with driver education — classroom complete and behind-the-wheel enrollment for under-18 applicants." },
  { q: "To pass the Minnesota knowledge test you must score at least:", o: ["70%", "75%", "80%", "90%"], a: 2, why: "80 percent — on the real 40-question test, that is 32 correct answers." },
  { q: "The vision screening for a permit requires at least:", o: ["20/20 vision", "20/40 vision and 105 degrees of peripheral vision", "20/70 vision", "Only a color-vision test, with no acuity check at all"], a: 1, why: "At least 20/40 (corrected is fine) with peripheral vision of at least 105 degrees." },
  { q: "How many knowledge tests may you take in one day?", o: ["Unlimited", "Three", "Two", "One"], a: 3, why: "One per day — and after two consecutive failures, a $10 fee applies to the third and later attempts." },
  { q: "Under-18 permit applicants must present:", o: ["A parent's license only", "A certificate of enrollment — the Blue Card or Pink Card — from driver education", "A recent school report card showing passing grades in every subject, signed by a teacher", "Proof of car ownership"], a: 1, why: "The Blue/Pink Card proves classroom instruction is complete and behind-the-wheel training is underway." },
  { q: "Before the road test, teen drivers must log supervised driving of at least:", o: ["10 hours", "30 hours", "50 hours, including 15 at night", "100 hours, all of them in daylight"], a: 2, why: "50 supervised hours with 15 at night (a certified parent course can reduce the total to 40) — logged and signed." },
  { q: "With an instruction permit, you may drive:", o: ["Alone, if it is daytime", "Only with a licensed driver beside you", "Alone after 3 months", "With any passenger who has a permit"], a: 1, why: "A permit is practice-only: a licensed driver rides beside you on every trip." },
  { q: "On the road test, the examiner first checks:", o: ["Your music taste", "Your vehicle's safety equipment", "Your parallel parking only", "Your knowledge-test score"], a: 1, why: "Lights, signals, brakes, horn, belts — a vehicle that fails its equipment check can end the test before it starts." },
  { q: "Minnesota's seatbelt law applies to:", o: ["The driver only", "Front-seat passengers only", "Everyone in the vehicle, front and back", "Adults only"], a: 2, why: "Everyone buckles — and officers may stop a vehicle for a belt violation alone." },
  { q: "Children under 9 years old — or under 4 feet 9 inches — must ride:", o: ["In the front seat", "In a child restraint or booster seat", "On an adult's lap", "Without a belt so they can move"], a: 1, why: "A booster or child seat positions the adult belt correctly — and the back seat is the safest place for kids." },
  { q: "While driving, Minnesota's hands-free law allows phone use:", o: ["Freely, if traffic is light", "Only by voice commands or one-touch activation", "For texting at red lights", "Holding the phone below the window line"], a: 1, why: "Hands-free only: voice or a single touch. Reading or typing texts while driving is illegal for everyone." },
  { q: "Drivers under 18 in Minnesota may use a cell phone while driving:", o: ["Freely, as long as a hands-free mount is used", "Only for music", "Not at all, except to call for emergency help", "Only on freeways"], a: 2, why: "Under-18 drivers may not use a phone behind the wheel at all — the exception is calling for emergency help." },
  { q: "After a crash, your first duties are to:", o: ["Drive away quickly if the damage to both cars looks small", "Stop, check for injuries, and call 911 if anyone is hurt", "Only exchange phone numbers", "Move the other driver's car"], a: 1, why: "Stop — leaving is a crime. Help the hurt, call 911, light the hazards, then exchange information." },
  { q: "At a crash scene you should exchange:", o: ["Nothing — insurance handles it all silently", "Names, driver license, and insurance information", "Only vehicle colors", "Social media handles"], a: 1, why: "Names, license numbers, plate numbers, and insurance details — with the other driver, calmly and completely." },
  { q: "Backing up on freeways and expressways is:", o: ["Allowed if you missed an exit and the shoulder is wide and empty", "Allowed on the shoulder only", "Prohibited, except for emergency vehicles on duty", "Allowed under 10 mph"], a: 2, why: "Never back on a freeway — drive to the next exit. Missed exits are cheaper than crashes." },
  { q: "Before backing up, the safest habit is to:", o: ["Rely on mirrors alone", "Walk around the vehicle to check behind it first", "Honk and go immediately", "Back up as fast as possible to get it over with quickly"], a: 1, why: "A quick walk-around finds the child, pet, or bike that no mirror or camera can promise you about." }
);

/* ---------- Drive mode UI: practice test in the PC tab + label polish ---------- */
(function cbDriveUI() {
  if (!window.__isDrive) return;
  var style = document.createElement("style");
  style.textContent =
    /* Loop 9 — the exam room: the practice test sits in its own quiet
       room. A deep-navy exam slip heads every screen (form tag on the
       left, the pass mark on the right), a 20-segment strip tracks the
       paper question by question, answers carry letter badges, and the
       result is stamped over a score ring with a review of every miss. */
    ".quiz-room{background:var(--card-grad,linear-gradient(170deg,var(--surface) 60%,var(--surface-2) 160%));border:1px solid var(--line);border-radius:var(--r-card);box-shadow:var(--elev-1,var(--shadow-sm));overflow:hidden;}" +
    ".quiz-slip{display:flex;justify-content:space-between;align-items:center;gap:8px 16px;flex-wrap:wrap;background:#0a2450;color:#dceeff;padding:12px 16px;}" +
    ".quiz-slip-tag{font-size:11.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;}" +
    ".quiz-slip-rule{font-size:12px;font-weight:700;letter-spacing:.05em;color:#9cc8ff;font-variant-numeric:tabular-nums;}" +
    ".quiz-body{padding:20px 20px 22px;}" +
    ".quiz-body h3{margin:0 0 6px;font-size:20px;}" +
    ".quiz-facts{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0 4px;}" +
    ".quiz-fact{flex:1 1 120px;background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-row);padding:10px 12px;text-align:center;}" +
    ".quiz-fact b{display:block;font-size:17px;font-weight:800;color:var(--accent-deep);font-variant-numeric:tabular-nums;}" +
    "@media (prefers-color-scheme: dark){.quiz-fact b{color:var(--accent-bright);}}" +
    ".quiz-fact span{font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);}" +
    ".quiz-segs{display:flex;gap:3px;margin-top:16px;}" +
    ".quiz-seg{flex:1 1 0;height:7px;border-radius:4px;background:var(--surface-2);border:1px solid var(--line);}" +
    ".quiz-seg.right{background:var(--accent);border-color:var(--accent);}" +
    ".quiz-seg.wrong{background:var(--bad);border-color:var(--bad);}" +
    ".quiz-seg.now{border-color:var(--accent);box-shadow:0 0 0 2px var(--good-soft);animation:quizSegPulse 1.6s ease-in-out infinite;}" +
    "@keyframes quizSegPulse{0%,100%{box-shadow:0 0 0 1px var(--good-soft);}50%{box-shadow:0 0 0 3px var(--good-soft);}}" +
    ".quiz-opts{display:grid;gap:8px;margin-top:16px;}" +
    ".quiz-opt{display:flex;align-items:flex-start;gap:11px;text-align:left;background:var(--surface);border:1.5px solid var(--line);border-radius:var(--r-row);padding:13px 14px;font-size:15px;font-weight:600;color:var(--ink);cursor:pointer;min-height:52px;font-family:inherit;line-height:1.45;transition:var(--tap,border-color .15s ease);}" +
    "@media (hover:hover){.quiz-opt:not(:disabled):hover{border-color:var(--accent-bright);transform:translateY(-1px);}}" +
    ".quiz-opt:active:not(:disabled){transform:translateY(1px);}" +
    ".quiz-opt:focus-visible{outline:3px solid var(--accent-bright);outline-offset:2px;}" +
    ".quiz-letter{flex:0 0 auto;width:26px;height:26px;margin-top:1px;border-radius:8px;background:var(--surface-2);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:12.5px;font-weight:800;color:var(--muted);}" +
    ".quiz-opt:disabled{cursor:default;opacity:1;}" +
    ".quiz-opt.right{border-color:var(--accent);background:var(--good-soft);color:var(--accent-deep);font-weight:800;}" +
    ".quiz-opt.right .quiz-letter{background:var(--accent);border-color:var(--accent);color:var(--on-accent);}" +
    ".quiz-opt.wrong{border-color:var(--bad);color:var(--bad);}" +
    ".quiz-opt.wrong .quiz-letter{background:var(--bad);border-color:var(--bad);color:#ffffff;}" +
    ".quiz-opt.faded{opacity:.55;}" +
    "@media (prefers-color-scheme: dark){.quiz-opt.right{color:var(--accent-bright);}}" +
    ".quiz-q{font-size:19px;font-weight:800;line-height:1.45;margin:16px 0 0;}" +
    ".quiz-why{margin-top:16px;font-size:14.5px;line-height:1.6;background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-row);padding:12px 14px;}" +
    ".quiz-why .quiz-why-tag{display:inline-block;font-size:10.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;border-radius:6px;padding:2px 8px;margin-right:8px;background:var(--accent);color:var(--on-accent);vertical-align:2px;}" +
    ".quiz-why.missed .quiz-why-tag{background:var(--bad);color:#ffffff;}" +
    ".quiz-keys{margin-top:12px;font-size:12px;color:var(--muted);}" +
    ".quiz-keys kbd{font-family:inherit;font-weight:700;background:var(--surface-2);border:1px solid var(--line);border-bottom-width:2px;border-radius:5px;padding:0 5px;}" +
    ".quiz-ring-wrap{display:flex;justify-content:center;margin:6px 0 2px;}" +
    ".quiz-ring{transform:rotate(-90deg);}" +
    ".quiz-ring .ring-track{stroke:var(--surface-2);}" +
    ".quiz-ring .ring-arc{stroke:var(--accent);transition:stroke-dashoffset .8s ease;}" +
    ".quiz-ring.fail .ring-arc{stroke:var(--bad);}" +
    ".quiz-ring-num{font-size:30px;font-weight:800;fill:var(--ink);font-variant-numeric:tabular-nums;}" +
    ".quiz-ring-sub{font-size:10.5px;font-weight:700;letter-spacing:.1em;fill:var(--muted);}" +
    ".quiz-review{text-align:left;margin-top:16px;}" +
    ".quiz-review h4{margin:0 0 4px;font-size:15px;}" +
    ".quiz-miss{border:1px solid var(--line);border-radius:var(--r-row);padding:12px 14px;margin-top:9px;background:var(--surface);}" +
    ".quiz-miss p{margin:0;font-size:14.5px;line-height:1.55;}" +
    ".quiz-miss .miss-q{font-weight:700;}" +
    ".quiz-miss .miss-a{margin-top:5px;}" +
    ".quiz-miss .miss-a b{color:var(--accent-deep);}" +
    "@media (prefers-color-scheme: dark){.quiz-miss .miss-a b{color:var(--accent-bright);}}" +
    ".quiz-miss .miss-why{margin-top:5px;color:var(--muted);font-size:13.5px;}" +
    ".quiz-stamp{display:inline-block;font-size:15px;font-weight:800;letter-spacing:.06em;border-radius:var(--r-row);padding:8px 16px;margin-top:6px;}" +
    ".quiz-stamp.pass{background:var(--good-soft);color:var(--accent-deep);border:1.5px solid var(--accent);}" +
    ".quiz-stamp.fail{background:var(--surface-2);color:var(--bad);border:1.5px solid var(--bad);}" +
    "@media (prefers-color-scheme: dark){.quiz-stamp.pass{color:var(--accent-bright);}}" +
    "@media (prefers-reduced-motion: reduce){.quiz-seg.now{animation:none;}.quiz-ring .ring-arc{transition:none;}.quiz-opt{transition:none;}}";
  document.head.appendChild(style);

  function setText(sel, txt) { var el = document.querySelector(sel); if (el) el.textContent = txt; }
  function setHTML(sel, html) { var el = document.querySelector(sel); if (el) el.innerHTML = html; }

  /* --- Sandbox / mastery polish --- */
  setText(".mastery-label", "Driving Mastery");
  setText("#masterpieceBanner h2", "The Road Masterpiece");
  setText("#masterpieceBanner p", "All 24 road blocks mastered. Every block in your world glows bright blue, and the music is playing the full arrangement. You know the rules of the road — one repeated line at a time.");
  setText(".music-note", "Chill generative music plays while you drill. Every block you master adds a new layer — finish all 24 and it blooms into the full piece.");
  setText("#sandboxView .source-note", "Curriculum follows the chapter order of the Minnesota Driver's Manual, used as inspiration only — facts and topic order, with every explanation written in Code Block's own words. Each block takes 8 perfect repetitions. Your Drive progress is saved separately from C++ and C#.");
  var lh = document.querySelector("#hubView .list-head h2");
  if (lh) lh.textContent = "All 24 road blocks";
  setText("#hubChip", DRIVE_BLOCKS.length + " blocks");
  setText("#hubHint", "In manual order — tap any block to drill it.");
  setText("#libChip", DRIVE_CHAPTERS.length + " chapters · " + DRIVE_SHELVES.length + " shelves");
  setText("#pcChip", DRIVE_QUIZ.length + " questions in the bank");
  setText("#pcHint", "Twenty questions per test — answer, learn the why, and 16 right passes.");
  var mc = document.querySelector(".mastery-count");
  if (mc) { for (var n = 0; n < mc.childNodes.length; n++) { if (mc.childNodes[n].nodeType === 3 && mc.childNodes[n].nodeValue.indexOf("of 30") >= 0) mc.childNodes[n].nodeValue = " of 24 road blocks mastered"; } }
  var world = document.getElementById("world");
  if (world) world.setAttribute("aria-label", "3D top-down world of 24 road blocks. Tap a block to open its drill, drag to look around, pinch or scroll to zoom, double-tap to reset the view, or focus here and use the arrow keys to look around, the plus and minus keys to zoom, and Enter to open your next block.");

  /* --- Library polish --- */
  setText("#libraryView .lib-intro h2", "The Drive Library");
  setHTML("#libraryView .lib-intro p:not(.sec-hint)", "The Minnesota Driver's Manual, retold in bright, simple words anyone can follow — facts and chapter order from the manual, every explanation written fresh for Code Block. Open a chapter, then read it two ways: <strong>Text</strong> tells you the idea in plain words, and <strong>Picture</strong> shows it moving, with music. Below the chapters: a sign gallery, a test-day kit, a road-words glossary, a vehicle field guide, and cheat cards for the numbers that pass the test.");
  var shelfHeads = document.querySelectorAll("#libHome .shelf-head");
  if (shelfHeads[0]) { shelfHeads[0].querySelector("h3").textContent = "Beyond the Manual — Drive Shelves"; shelfHeads[0].querySelector("p").textContent = "Two shelves past the manual's chapters: the sign gallery and the test-day kit. Each reads two ways, Text and Picture, just like a chapter — and both are open to everyone."; }
  if (shelfHeads[1]) { shelfHeads[1].querySelector("h3").textContent = "The Glossary — Words of the Road"; shelfHeads[1].querySelector("p").textContent = "The vocabulary of Minnesota driving, each word in one plain sentence. Search it, or jump by letter."; }
  if (shelfHeads[2]) { shelfHeads[2].querySelector("h3").textContent = "Field Guide — Your Vehicle, Up Close"; shelfHeads[2].querySelector("p").textContent = "Ten pieces of the car every driver must know — what they do, when they matter, and the one line to remember about each."; }
  if (shelfHeads[3]) { shelfHeads[3].querySelector("h3").textContent = "Cheat Sheets — Numbers That Pass"; shelfHeads[3].querySelector("p").textContent = "Pin-up cards for test day: the speed numbers, the distance numbers, the shapes, the lights, the winter rules."; }
  var gs = document.getElementById("glossSearch");
  if (gs) gs.placeholder = "Search road words… try “yield” or “BAC”";
  var libNotes = document.querySelectorAll("#libraryView .source-note");
  if (libNotes[0]) libNotes[0].textContent = "Every chapter is an original retelling in simple words, following the manual's chapter order. The rules themselves are the same ones you drill in the Sandbox.";
  if (libNotes[1]) libNotes[1].textContent = "Facts follow the Minnesota Driver's Manual (Minnesota Department of Public Safety, Driver and Vehicle Services), with every explanation written fresh in Code Block's own words.";

  /* --- Book + Vault polish --- */
  setHTML("#bookView .book-intro p:not(.sec-hint)", "The full manual, right here in Code Block: the <em>Minnesota Driver's Manual</em> from Driver and Vehicle Services. Open your own copy of the manual (the PDF file) and read the entire thing without leaving the site.");
  setText("#vaultView .lib-intro h2", "The Vault — 10,000 Road Drills");
  setHTML("#vaultView .lib-intro p:not(.sec-hint)", "The members-only drill vault, on the road: <strong>100 themed packs of 100 drills each — 10,000 rules of the road</strong> to type until your eyes know them all. Every drill states a true Minnesota rule. Your Drive Vault progress saves under your profile, separately from the C++ and C# Vaults.");
  /* Loop 62 — the profile intro is C++ copy: it promises guests all
     but two shelves and a profile two extra ones, but both Drive
     shelves are open to everyone (the shelf head above says so).
     In Drive the profile's prize is the Vault and a name on the
     progression. */
  setText("#profileView .sec-hint", "Create a profile to unlock the Vault.");
  setHTML("#profileView .lib-intro p:not(.sec-hint)", "Code Block is free to explore as a guest — every block, chapter, practice test and shelf on the site works without signing up, both Drive shelves included. Create a free profile on this device and two things happen: <strong>your progression is saved under your name</strong> (Sandbox mastery and Vault drills, kept separately for each profile), and the members-only <strong>10,000-drill Vault</strong> unlocks. Profiles live on this device only; nothing is uploaded anywhere.");

  /* --- Footer credit --- */
  var notes = document.querySelectorAll(".wrap > .source-note");
  if (notes.length) {
    var add = document.createElement("span");
    add.innerHTML = ' Driving content is inspired by the <a href="https://dps.mn.gov/divisions/dvs">Minnesota Driver\u2019s Manual</a> (Minnesota Department of Public Safety) — topic order and facts only; every explanation and test question is written in Code Block\u2019s own words.';
    notes[notes.length - 1].appendChild(add);
  }

  /* --- PC tab becomes the Permit Practice Test --- */
  var menuPc = document.getElementById("menuPc");
  if (menuPc) { for (var m = 0; m < menuPc.childNodes.length; m++) { if (menuPc.childNodes[m].nodeType === 3 && menuPc.childNodes[m].nodeValue.indexOf("PC") >= 0) menuPc.childNodes[m].nodeValue = " Test"; } }
  setText("#pcView .pc-intro h2", "Permit Practice Test");
  setHTML("#pcView .pc-intro p:not(.sec-hint)", "A practice version of Minnesota's knowledge test. Each test draws <strong>20 random questions</strong> from a bank of " + DRIVE_QUIZ.length + " — signs, speeds, right-of-way, parking, winter, and the laws. Answer, get the why instantly, and finish with a score. <strong>16 of 20 (80%) passes</strong> — the same bar as the real test, where 32 of 40 passes.");
  var frame = document.querySelector("#pcView .pc-frame");
  if (frame) frame.classList.add("hidden");
  var explain = document.querySelector("#pcView .pc-explain");
  if (explain) explain.classList.add("hidden");
  var pcView = document.getElementById("pcView");
  if (!pcView) return;
  var host = document.createElement("div");
  host.id = "driveQuiz";
  pcView.appendChild(host);

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function bestGet() {
    try {
      var st = window.cbStore;
      if (st && st.active && st.profiles[st.active]) return st.profiles[st.active].driveBest || 0;
      return parseInt(localStorage.getItem("code-block-drive-best-v1") || "0", 10) || 0;
    } catch (e) { return 0; }
  }
  function bestSet(v) {
    try {
      var st = window.cbStore;
      if (st && st.active && st.profiles[st.active]) {
        st.profiles[st.active].driveBest = v;
        if (window.cbSaveStore) window.cbSaveStore();
      } else {
        localStorage.setItem("code-block-drive-best-v1", String(v));
      }
    } catch (e) {}
  }
  var quiz = null;
  function quizSlip(right) {
    return '<div class="quiz-slip"><span class="quiz-slip-tag"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-clipboard"/></svg>Minnesota Knowledge Test · Practice Form</span><span class="quiz-slip-rule">' + right + '</span></div>';
  }
  function renderStart() {
    var best = bestGet();
    host.innerHTML =
      '<div class="quiz-room">' + quizSlip("Pass mark 16 / 20 · 80%") +
      '<div class="quiz-body"><span class="es-ico" style="margin:0 0 11px;" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="#i-clipboard"/></svg></span><h3>Ready when you are</h3>' +
      '<p class="prof-sub">Step into the exam room. Every question explains itself the moment you answer — wrong answers teach as much as right ones.</p>' +
      '<div class="quiz-facts">' +
      '<div class="quiz-fact"><b>' + DRIVE_QUIZ.length + '</b><span>Questions in the bank</span></div>' +
      '<div class="quiz-fact"><b>20</b><span>Per test</span></div>' +
      '<div class="quiz-fact"><b>16 / 20</b><span>Passes · 80%</span></div>' +
      '</div>' +
      (best > 0 ? '<p class="prof-sub" style="margin-top:10px;">Your best score so far: <strong>' + best + ' / 20</strong>.</p>' : '<p class="prof-sub" style="margin-top:10px;">No test taken yet — your best score will be saved here.</p>') +
      '<button class="big-btn" id="quizStart" type="button">Start a practice test</button></div></div>';
    document.getElementById("quizStart").addEventListener("click", startTest);
  }
  function startTest() {
    var picked = shuffle(DRIVE_QUIZ.map(function (_, i) { return i; })).slice(0, 20);
    quiz = { order: picked, idx: 0, score: 0, locked: false, opts: null, history: [] };
    renderQuestion();
  }
  function segStrip() {
    var out = '<div class="quiz-segs" aria-hidden="true">';
    for (var s = 0; s < 20; s++) {
      var cls = "quiz-seg";
      if (s < quiz.history.length) cls += quiz.history[s].ok ? " right" : " wrong";
      else if (s === quiz.idx) cls += " now";
      out += '<span class="' + cls + '"></span>';
    }
    return out + "</div>";
  }
  function renderQuestion() {
    var item = DRIVE_QUIZ[quiz.order[quiz.idx]];
    quiz.opts = shuffle(item.o.map(function (txt, i) { return { txt: txt, right: i === item.a }; }));
    quiz.locked = false;
    var letters = ["A", "B", "C", "D", "E"];
    host.innerHTML =
      '<div class="quiz-room">' + quizSlip("Question " + (quiz.idx + 1) + " of 20 · " + quiz.score + " correct") +
      '<div class="quiz-body">' + segStrip() +
      '<p class="quiz-q">' + item.q + '</p>' +
      '<div class="quiz-opts" id="quizOpts">' +
      quiz.opts.map(function (o, i) { return '<button class="quiz-opt" type="button" data-opt="' + i + '"><span class="quiz-letter" aria-hidden="true">' + letters[i] + '</span><span>' + o.txt + '</span></button>'; }).join("") +
      '</div><div id="quizWhy"></div>' +
      '<p class="quiz-keys">Keyboard: press <kbd>1</kbd>–<kbd>4</kbd> or <kbd>A</kbd>–<kbd>D</kbd> to answer, <kbd>Enter</kbd> to continue.</p>' +
      '</div></div>';
    Array.prototype.forEach.call(host.querySelectorAll("[data-opt]"), function (b) {
      b.addEventListener("click", function () { answer(parseInt(b.getAttribute("data-opt"), 10)); });
    });
    /* Loop 50 — each question repaints the whole room, which
       destroys the button that had focus; a listener is left on
       the page body with no idea a new question arrived. Speak the
       question and its place in the twenty. */
    if (window.cbAnnounce) window.cbAnnounce("Question " + (quiz.idx + 1) + " of 20. " + item.q);
  }
  function answer(i) {
    if (!quiz || quiz.locked) return;
    quiz.locked = true;
    var item = DRIVE_QUIZ[quiz.order[quiz.idx]];
    var chosen = quiz.opts[i];
    if (chosen.right) quiz.score++;
    var rightTxt = "";
    quiz.opts.forEach(function (o) { if (o.right) rightTxt = o.txt; });
    quiz.history.push({ q: item.q, ok: !!chosen.right, chosenTxt: chosen.txt, rightTxt: rightTxt, why: item.why });
    Array.prototype.forEach.call(host.querySelectorAll("[data-opt]"), function (b) {
      var bi = parseInt(b.getAttribute("data-opt"), 10);
      b.disabled = true;
      if (quiz.opts[bi].right) b.classList.add("right");
      else if (bi === i) b.classList.add("wrong");
      else b.classList.add("faded");
    });
    /* The slip and the segment strip update in place, so the answer
       lands without the room repainting around it. */
    var slipRule = host.querySelector(".quiz-slip-rule");
    if (slipRule) slipRule.textContent = "Question " + (quiz.idx + 1) + " of 20 · " + quiz.score + " correct";
    var segs = host.querySelectorAll(".quiz-seg");
    if (segs[quiz.idx]) { segs[quiz.idx].classList.remove("now"); segs[quiz.idx].classList.add(chosen.right ? "right" : "wrong"); }
    var last = quiz.idx >= 19;
    document.getElementById("quizWhy").innerHTML =
      '<div class="quiz-why' + (chosen.right ? "" : " missed") + '"><span class="quiz-why-tag">' + (chosen.right ? "Correct" : "The why") + '</span>' + (chosen.right ? "" : "<strong>Not quite — the right answer is highlighted. </strong>") + item.why + '</div>' +
      '<button class="big-btn" id="quizNext" type="button">' + (last ? "See my score" : "Next question") + '</button>';
    document.getElementById("quizNext").addEventListener("click", function () {
      quiz.idx++;
      if (quiz.idx >= 20) renderResult(); else renderQuestion();
    });
    /* Loop 50 — focus jumps straight to the Next button, so the
       verdict and the why (the teaching half of every answer) were
       never heard. Speak them: verdict first, then the why, and
       for a miss name the right answer before it. */
    if (window.cbAnnounce) window.cbAnnounce(chosen.right ? "Correct. " + item.why : "Not quite. The right answer is: " + rightTxt + ". " + item.why);
    var nx = document.getElementById("quizNext");
    if (nx) nx.focus();
  }
  function renderResult() {
    var s = quiz.score, pass = s >= 16;
    var best = bestGet();
    if (s > best) { bestSet(s); best = s; }
    var cheer = pass
      ? (s === 20 ? "A perfect drive. The real test will feel like a formality." : "That is a passing score — the real test asks the same facts in the same spirit. Keep the blocks warm and go take it.")
      : (s >= 12 ? "Close. Your misses are reviewed below — drill the matching road blocks, then run it back." : "Every expert driver started exactly here. Read a Library chapter or two, drill the blocks, and take another run — this is what practice is for.");
    /* Score ring: circumference 2πr ≈ 264 for r=42. The arc fills to
       score/20, and a small tick on the track marks the 80% pass line. */
    var C = 264, arc = (C * s / 20).toFixed(1), tick = (C * 0.8).toFixed(1);
    var ring =
      '<div class="quiz-ring-wrap"><svg class="quiz-ring' + (pass ? "" : " fail") + '" width="120" height="120" viewBox="0 0 120 120" role="img" aria-label="Score ' + s + ' of 20">' +
      '<circle class="ring-track" cx="60" cy="60" r="42" fill="none" stroke-width="10"></circle>' +
      '<circle cx="60" cy="60" r="42" fill="none" stroke="var(--ink)" stroke-width="3" stroke-dasharray="2 ' + (C - 2) + '" stroke-dashoffset="-' + tick + '" opacity="0.55"></circle>' +
      '<circle class="ring-arc" cx="60" cy="60" r="42" fill="none" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="' + (C - arc) + '"></circle>' +
      '<g transform="rotate(90 60 60)"><text class="quiz-ring-num" x="60" y="58" text-anchor="middle">' + s + '<tspan font-size="16"> / 20</tspan></text>' +
      '<text class="quiz-ring-sub" x="60" y="76" text-anchor="middle">YOUR SCORE</text></g></svg></div>';
    var misses = quiz.history.filter(function (h) { return !h.ok; });
    var review = "";
    if (misses.length) {
      review = '<div class="quiz-review"><h4>Review the ones that got away — ' + misses.length + ' of 20</h4>' +
        '<p class="prof-sub">Each miss below shows the right answer and the why. These are the highest-value facts on the paper — learn them and the next run is a different test.</p>' +
        misses.map(function (h) {
          return '<div class="quiz-miss"><p class="miss-q">' + h.q + '</p>' +
            '<p class="miss-a">You picked: ' + h.chosenTxt + '<br>Right answer: <b>' + h.rightTxt + '</b></p>' +
            '<p class="miss-why">' + h.why + '</p></div>';
        }).join("") + "</div>";
    } else {
      review = '<div class="quiz-review"><h4>Nothing to review</h4><p class="prof-sub">Every question answered correctly — the cleanest paper the exam room has seen.</p></div>';
    }
    host.innerHTML =
      '<div class="quiz-room">' + quizSlip(pass ? "Result · Passed" : "Result · Keep practicing") +
      '<div class="quiz-body" style="text-align:center;"><h3>Test complete</h3>' + ring +
      '<span class="quiz-stamp ' + (pass ? "pass" : "fail") + '">' + (pass ? "PASS — 80% bar cleared" : "NOT YET — 16 of 20 passes") + '</span>' +
      '<p class="prof-sub" style="margin-top:12px;">' + cheer + '</p>' +
      '<p class="prof-sub">Best score: <strong>' + best + ' / 20</strong> · On the real Minnesota test, 32 of 40 (80%) passes.</p>' +
      review +
      '<button class="big-btn" id="quizAgain" type="button">New test — 20 fresh questions</button>' +
      '<button class="ghost-btn" id="quizHome" type="button">Back to the test start</button></div></div>';
    document.getElementById("quizAgain").addEventListener("click", startTest);
    document.getElementById("quizHome").addEventListener("click", renderStart);
    /* Loop 50 — the result room replaces the question silently;
       the ring already carries a text label, but nothing speaks
       unless asked. Announce the score and the verdict once. */
    if (window.cbAnnounce) window.cbAnnounce("Test complete. You scored " + s + " of 20 — " + (pass ? "passed, the 80 percent bar is cleared." : "not yet; 16 of 20 passes.") + " Best score: " + best + " of 20.");
  }
  /* Keyboard driving for the exam room: 1–4 / A–D answer the open
     question, Enter moves on once it is locked. Only while the Test
     view is on screen and nobody is typing in a field. */
  document.addEventListener("keydown", function (ev) {
    if (!quiz || !host.offsetParent) return;
    var tag = (ev.target && ev.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (quiz.locked) {
      if (ev.key === "Enter" && document.activeElement && document.activeElement.id !== "quizNext") {
        var nx = document.getElementById("quizNext");
        if (nx) { ev.preventDefault(); nx.click(); }
      }
      return;
    }
    var k = (ev.key || "").toLowerCase();
    var idx = -1;
    if (k >= "1" && k <= "9") idx = parseInt(k, 10) - 1;
    else if (k >= "a" && k <= "z") idx = k.charCodeAt(0) - 97;
    if (idx >= 0 && quiz.opts && idx < quiz.opts.length) { ev.preventDefault(); answer(idx); }
  });
  renderStart();
})();
