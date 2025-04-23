import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Info, ShieldCheck } from "lucide-react";

const drugInfo = {
  Vancomycin: `**Vancomycin**\n- Spectrum: Gram-positive, including MRSA\n- PK: Time-dependent killing, IV only, renal clearance\n- Toxicities: Nephrotoxicity, red man syndrome`,
  Cefazolin: `**Cefazolin**\n- Spectrum: MSSA, Streptococci\n- PK: Time-dependent killing, IV, renally cleared\n- Toxicities: Rare hypersensitivity, generally well tolerated`,
  Nafcillin: `**Nafcillin**\n- Spectrum: MSSA only\n- PK: IV, hepatic metabolism\n- Toxicities: Interstitial nephritis, phlebitis, liver enzyme elevations`,
  Daptomycin: `**Daptomycin**\n- Spectrum: MRSA, VRE\n- PK: Concentration-dependent killing, inactivated by lung surfactant\n- Toxicities: Myopathy, requires CK monitoring`,
  Ceftriaxone: `**Ceftriaxone**\n- Spectrum: Broad Gram-negative and some Gram-positive\n- PK: Time-dependent killing, IV/IM, hepatic and renal elimination\n- Toxicities: Biliary sludging, GI upset, rash`
};

const scenarios = {
  intro: {
    text: `On a chilly evening, while sipping your chamomile tea with honey in the internal medicine staff room where you work as a physician assistant,
suddenly the phone rings. After confirming (damn it) that there’s no one else around to answer, you pick up the receiver:
"Hello, this is the microbiology lab. Mr. Nehmadi Nehmad has Staphylococcus aureus in his blood culture. Sensitivities will be ready tomorrow. Got it?"
"Got it."

What treatment would you recommend the on-call resident start for the nice gentleman?`,
    options: ["empiric"],
  },
  empiric: {
    text: `You consider empiric treatment options. It’s nighttime, sensitivities aren’t back yet, and all eyes are on you.
What do you start for now?`,
    options: ["VancomycinEmp", "CefazolinEmp", "NafcillinEmp", "Ceftriaxone"],
  },
  VancomycinEmp: {
    text: `You start Vancomycin. It covers both MRSA (methicillin-resistant Staphylococcus aureus) and MSSA (methicillin-sensitive Staphylococcus aureus), and is a reasonable empiric choice in settings with high MRSA prevalence.

However, Vancomycin is less effective than beta-lactams for treating MSSA. Studies have shown worse outcomes in patients treated with Vancomycin when the pathogen was actually sensitive.

The next day, sensitivities return: the bug is MSSA.`,
    options: ["start"],
  },
  CefazolinEmp: {
    text: `You start Cefazolin. It is the drug of choice for MSSA (methicillin-sensitive Staphylococcus aureus), but it does not cover MRSA (methicillin-resistant Staphylococcus aureus).

It’s a great option for empiric treatment in patients without risk factors for MRSA and in areas where MRSA prevalence is low.

The next day, sensitivities return: the bug is MSSA.`,
    options: ["start"],
  },
  NafcillinEmp: {
    text: `You start Nafcillin. This beta-lactam is highly effective against MSSA (methicillin-sensitive Staphylococcus aureus), but it does not cover MRSA (methicillin-resistant Staphylococcus aureus).

It can be considered for empiric treatment in patients at low risk for MRSA, but is generally less favored due to toxicity risks and frequent dosing compared to Cefazolin.

The next day, sensitivities return: the bug is MSSA.`,
    options: ["start"],
  },
  start: {
    text: `Your senior looks at you. “Your call. What’s the best antibiotic?”`,
    options: ["Vancomycin", "Cefazolin", "Nafcillin", "Daptomycin"],
  },
  Vancomycin: {
    text: `You boldly choose Vancomycin. After all, it worked for MRSA once, right?
Three days later: The cultures are still positive. The creatinine creeps up. The nephrologist leaves you a Post-it note that says “🥴”.
The attending stares at you in silence. It's worse than yelling.
❌ MSSA + Vancomycin = not your best combo.`,
    options: ["Restart"],
  },
  Cefazolin: {
    text: `A golden choice! You switch to Cefazolin, and your patient is afebrile in 48 hours.
The ID team gives you an approving nod. The pharmacist gives you a cookie. The nurse gives you the “finally someone gets it” thumbs-up.
🎉 You win! Stewardship hero, kidney saver, and clinical rockstar.`,
    options: ["Restart"],
  },
  Nafcillin: {
    text: `Ah, the OG anti-staph agent. It works fast — the patient improves.
Unfortunately, so does the creatinine. The patient develops a rash and keeps asking why the IV alarm keeps going off.
You're now spending 30% of your day managing fluids and ordering labs.
✅ Good choice medically — just don’t forget the toxicity price tag.`,
    options: ["Restart"],
  },
  Daptomycin: {
    text: `You opt for the Bugatti of antibiotics: Daptomycin.
One hour later, you get a call:
“Hi, this is the CEO. Are you aware you just used an entire department’s monthly budget… for MSSA?”
The patient is fine. Your reputation? Less so. The ID fellow calls you “Dr. Dapto” for the rest of the rotation.
❌ Next time, save Daptomycin for when it’s actually needed.`,
    options: ["Restart"],
  },
  Ceftriaxone: {
    text: `You go with Ceftriaxone — a noble empiric bet, broad yet elegant.
Too bad MSSA doesn’t really care about elegance. The next day the ID team politely suggests switching to a beta-lactam more suited for the job.
The pharmacist sighs audibly. The nurse rolls her eyes.
❌ Nice try, but let’s tighten that spectrum.`,
    options: ["Restart"],
  },
}; // your existing scenarios stay unchanged

export default function MSSAMayhemApp() {
  const [scene, setScene] = useState("intro");

  const renderTextWithDrugPopups = (text) => {
    const words = text.split(/(\bVancomycin\b|\bCefazolin\b|\bNafcillin\b|\bDaptomycin\b|\bCeftriaxone\b)/g);
    return words.map((word, index) => {
      const cleanWord = word.replace("Emp", "");
      if (drugInfo[cleanWord]) {
        return (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <Button variant="link" className="px-1 text-blue-600 hover:underline">
                {cleanWord} <Info className="inline w-4 h-4 ml-1" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-2 border-blue-200 shadow-xl">
              <DialogTitle className="flex items-center gap-2 text-blue-800">
                <ShieldCheck className="w-5 h-5 text-green-600" /> {cleanWord} Info
              </DialogTitle>
              <pre className="whitespace-pre-wrap text-left text-sm leading-relaxed text-gray-800">
                {drugInfo[cleanWord]}
              </pre>
            </DialogContent>
          </Dialog>
        );
      }
      return <span key={index}>{word}</span>;
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <Card>
        <CardContent className="p-6 text-lg whitespace-pre-line">
          {renderTextWithDrugPopups(scenarios[scene].text)}
        </CardContent>
      </Card>
      <div className="flex flex-col space-y-2">
        {scenarios[scene].options.map((option) => {
          const cleanOption = option.replace("Emp", "");
          const label = option === "start" ? "Next" : cleanOption;
          return (
            <div key={option} className="flex items-center space-x-2">
              <Button
                onClick={() => setScene(option === "Restart" ? "intro" : option)}
                className="w-full"
              >
                {label}
              </Button>
              {drugInfo[cleanOption] && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="shrink-0">Info</Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white border-2 border-blue-200 shadow-xl">
                    <DialogTitle className="flex items-center gap-2 text-blue-800">
                      <ShieldCheck className="w-5 h-5 text-green-600" /> {cleanOption} Info
                    </DialogTitle>
                    <pre className="whitespace-pre-wrap text-left text-sm leading-relaxed text-gray-800">
                      {drugInfo[cleanOption]}
                    </pre>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}