import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  AlertTriangle,
  Brain,
  Calendar,
  Heart,
  LucideIcon,
  Moon,
  Salad,
  Shield,
  Stethoscope,
  Target
} from "lucide-react";

/**
 * Mobile‑first, accordion‑only UI that mirrors the provided screenshot.
 * Pass your JSON blueprint via the `blueprint` prop. The component
 * formats content for readability on small screens.
 */

type StringDict = Record<string, string | number | null | undefined>;

type Blueprint = {
  overall_health_summary_watchlist?: {
    summary?: string;
    active_issues_to_monitor?: { issue?: string; status?: string; next_steps?: string }[];
  };
  inherited_risk_family_patterning?: { title?: string; description?: string; risk_to_you?: string; recommendations?: string[] }[];
  screening_preventive_testing_roadmap?: { test_or_screening?: string; start_age?: number | string; frequency?: string; notes?: string }[];
  nutritional_strategy_supplementation?: { diet_focus?: string; emphasize?: string[]; limit?: string[]; targeted_supplements?: { supplement?: string; purpose?: string; dose?: string }[] };
  fitness_recovery_lifestyle?: { exercise_plan?: { strength_training?: string; cardio?: string; pilates_stretch_mobility?: string }; hormone_monitoring?: string[] };
  cognitive_emotional_health?: { mental_wellness?: string[] };
  personalized_preventive_considerations?: string[];
};

function BulletList({ items }: { items?: (string | undefined)[] }) {
  if (!items || items.length === 0) return <p className="text-sm text-muted-foreground">No items.</p>;
  return (
    <ul className="list-disc pl-5 space-y-1 text-[15px] leading-6">
      {items.filter(Boolean).map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

function KeyValue({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="text-[15px] leading-6">
      <span className="text-muted-foreground">{label}: </span>
      <span className="font-medium">{value ?? "-"}</span>
    </div>
  );
}

function SectionHeader({ title, Icon }: { title: string; Icon: LucideIcon }) {
  return (
    <div className="flex items-center gap-3 text-[17px] font-semibold">
      <Icon className="h-5 w-5 text-[#C85A2E]"/>
      <span>{title}</span>
    </div>
  );
}

export default function HealthBlueprintUI({
  decade = "Your 50's summary",
  rating = "Excellent",
  blueprint
}: {
  decade?: string;
  rating?: string;
  blueprint?: Blueprint;
}) {
  const factors = (blueprint?.overall_health_summary_watchlist?.active_issues_to_monitor || [])
    .map(i => (i?.issue ? `${i.issue}${i.status ? ` — ${i.status}` : ""}${i.next_steps ? `, ${i.next_steps}` : ""}` : undefined));

  const decadeFocus = blueprint?.overall_health_summary_watchlist?.summary
    ? [blueprint.overall_health_summary_watchlist.summary]
    : [];

  // The following properties may not exist on overall_health_summary_watchlist, so we use optional chaining and fallback to undefined.
  const profile = (blueprint as any)?.personalized_health_profile as any | undefined;
  const strengths = (blueprint as any)?.overall_health_summary_watchlist?.key_strengths as StringDict | undefined;
  const reminders = (blueprint as any)?.overall_health_summary_watchlist?.watchlist_reminders as string[] | undefined;
  const labs = (blueprint as any)?.overall_health_summary_watchlist?.vitals_lab_highlights as any | undefined;

  return (
    <div className="mx-auto w-full max-w-md bg-[#FAF6F2]">
      {/* Banner */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-[#F0E4DC]">
        <div className="bg-gradient-to-b from-[#D36B3B] to-[#C55728] p-4 pb-5 rounded-b-none">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Activity className="h-5 w-5 text-white"/>
            </div>
            <div className="flex-1">
              <h1 className="text-white text-[18px] font-semibold tracking-tight">{decade}</h1>
              <div className="mt-2 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[12px] font-medium text-[#2F7D31] shadow">
                {rating}
              </div>
            </div>
          </div>
        </div>

        {/* Body (mobile-first) */}
        <div className="bg-white p-4 space-y-6">
          {/* Factors to monitor */}
          <div className="space-y-2">
            <SectionHeader title="Factors to monitor" Icon={AlertTriangle} />
            <BulletList items={factors} />
          </div>

          {/* This decade focus */}
          <div className="space-y-2">
            <SectionHeader title="This decade focus" Icon={Calendar} />
            <BulletList items={decadeFocus} />
          </div>

          <Separator className="bg-[#F1E7E0]"/>

          {/* ACCORDIONS */}
          <Accordion type="single" collapsible className="w-full">
            {/* Profile */}
            <AccordionItem value="profile">
              <AccordionTrigger className="justify-between text-left text-[16px] font-semibold py-4">
                <div className="flex items-center gap-3"><Shield className="h-5 w-5 text-[#C85A2E]"/> Personal profile</div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-4 text-[15px] leading-6 space-y-3">
                {profile ? (
                  <>
                    <div className="grid grid-cols-1 gap-2">
                      {profile.name && <KeyValue label="Name" value={profile.name}/>} 
                      {profile.age && <KeyValue label="Age" value={profile.age}/>} 
                      {profile.sex && <KeyValue label="Sex" value={profile.sex}/>} 
                      {profile.date_of_birth && <KeyValue label="Date of birth" value={profile.date_of_birth}/>} 
                    </div>
                    <div>
                      <div className="text-muted-foreground text-[13px] mb-1">Current medications</div>
                      {profile.current_medications?.length ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {profile.current_medications.map((m: any, i: number) => (
                            <li key={i}>{m?.name}{m?.dosage ? ` • ${m.dosage}` : ""}{m?.frequency ? ` • ${m.frequency}` : ""}</li>
                          ))}
                        </ul>
                      ) : (<p className="text-muted-foreground">None</p>)}
                    </div>
                    <div>
                      <div className="text-muted-foreground text-[13px] mb-1">Allergies</div>
                      {profile.allergies?.length ? <BulletList items={profile.allergies}/> : <p className="text-muted-foreground">No known allergies</p>}
                    </div>
                  </>
                ) : (<p className="text-muted-foreground">No profile data.</p>)}
              </AccordionContent>
            </AccordionItem>

            {/* Key strengths */}
            <AccordionItem value="strengths">
              <AccordionTrigger className="justify-between text-left text-[16px] font-semibold py-4">
                <div className="flex items-center gap-3"><Heart className="h-5 w-5 text-[#C85A2E]"/> Key strengths</div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-4 text-[15px] leading-6">
                {strengths ? (
                  <ul className="space-y-2">
                    {Object.entries(strengths).map(([k,v]) => (
                      <li key={k} className="rounded-md border p-3"><span className="text-muted-foreground capitalize">{k.replace(/_/g," ")}:</span> <span className="font-medium">{String(v ?? "-")}</span></li>
                    ))}
                  </ul>
                ) : (<p className="text-muted-foreground">No strengths listed.</p>)}
              </AccordionContent>
            </AccordionItem>

            {/* Watchlist reminders */}
            <AccordionItem value="reminders">
              <AccordionTrigger className="justify-between text-left text-[16px] font-semibold py-4">
                <div className="flex items-center gap-3"><Shield className="h-5 w-5 text-[#C85A2E]"/> Watchlist reminders</div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-4 text-[15px] leading-6">
                {reminders?.length ? <BulletList items={reminders}/> : <p className="text-muted-foreground">No reminders.</p>}
              </AccordionContent>
            </AccordionItem>

            {/* Vitals & labs */}
            <AccordionItem value="labs">
              <AccordionTrigger className="justify-between text-left text-[16px] font-semibold py-4">
                <div className="flex items-center gap-3"><Stethoscope className="h-5 w-5 text-[#C85A2E]"/> Vitals & labs</div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-4 text-[15px] leading-6 space-y-4">
                {labs ? (
                  <>
                    {Object.entries(labs).map(([group, values]) => (
                      <div key={group}>
                        <div className="text-[13px] text-muted-foreground mb-2 capitalize">{group.replace(/_/g, " ")}</div>
                        <ul className="space-y-2">
                          {Object.entries(values as any).map(([k,v]) => (
                            <li key={k} className="flex justify-between rounded-md border p-3">
                              <span className="capitalize text-muted-foreground">{k.replace(/_/g, " ")}</span>
                              <span className="font-medium">{String(v ?? "-")}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </>
                ) : (<p className="text-muted-foreground">No lab highlights.</p>)}
              </AccordionContent>
            </AccordionItem>

            {/* Family patterns to watch */}
            <AccordionItem value="family">
              <AccordionTrigger className="justify-between text-left text-[16px] font-semibold py-4">
                <div className="flex items-center gap-3"><Shield className="h-5 w-5 text-[#C85A2E]"/> Family patterns to watch</div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-4 text-[15px] leading-6">
                {blueprint?.inherited_risk_family_patterning?.length ? (
                  <div className="space-y-5">
                    {blueprint.inherited_risk_family_patterning.map((it, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="font-semibold">{it.title}</div>
                        {it.description && <p>{it.description}</p>}
                        {it.risk_to_you && <KeyValue label="Risk to you" value={it.risk_to_you} />}
                        {it.recommendations && (
                          <div>
                            <div className="text-muted-foreground text-[13px] mb-1">What to do</div>
                            <BulletList items={it.recommendations} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No family patterns.</p>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Family patterning risk profile */}
            <AccordionItem value="familyRiskProfile">
              <AccordionTrigger className="justify-between text-left text-[16px] font-semibold py-4">
                <div className="flex items-center gap-3"><Shield className="h-5 w-5 text-[#C85A2E]"/> Family patterning risk profile</div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-4 text-[15px] leading-6">
                {((blueprint as any)?.family_patterning_risk_profile)?.length ? (
                  <ul className="space-y-3">
                    {(blueprint as any).family_patterning_risk_profile.map((r: any, i: number) => (
                      <li key={i} className="rounded-md border p-3 space-y-1">
                        <div className="font-medium">{r.condition}</div>
                        <KeyValue label="Baseline lifetime risk" value={r.baseline_lifetime_risk} />
                        <KeyValue label="Your estimated risk" value={r.your_estimated_risk} />
                        <KeyValue label="Relative risk" value={r.relative_risk} />
                        <KeyValue label="Percentile" value={r.percentile} />
                      </li>
                    ))}
                  </ul>
                ) : (<p className="text-muted-foreground">No entries.</p>)}
              </AccordionContent>
            </AccordionItem>

            {/* Summary risk percentiles */}
            <AccordionItem value="summaryPercentiles">
              <AccordionTrigger className="justify-between text-left text-[16px] font-semibold py-4">
                <div className="flex items-center gap-3"><Shield className="h-5 w-5 text-[#C85A2E]"/> Summary risk percentiles</div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-4 text-[15px] leading-6">
                {(blueprint as any)?.summary_risk_percentiles?.length ? (
                  <ul className="space-y-3">
                    {(blueprint as any).summary_risk_percentiles.map((r: any, i: number) => (
                      <li key={i} className="rounded-md border p-3">
                        <div className="font-medium">{r.condition}</div>
                        <div className="text-[13px] text-muted-foreground mt-1">Relative risk: {r.relative_risk ?? "-"} • Percentile: {r.percentile_estimate ?? "-"}</div>
                      </li>
                    ))}
                  </ul>
                ) : (<p className="text-muted-foreground">No entries.</p>)}
              </AccordionContent>
            </AccordionItem>

            {/* Risk mitigation */}
            <AccordionItem value="mitigation">
              <AccordionTrigger className="justify-between text-left text-[16px] font-semibold py-4">
                <div className="flex items-center gap-3"><Target className="h-5 w-5 text-[#C85A2E]"/> Risk mitigation</div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-4 text-[15px] leading-6">
                {(blueprint as any)?.risk_mitigation?.length ? (
                  <ul className="space-y-3">
                    {(blueprint as any).risk_mitigation.map((r: any, i: number) => (
                      <li key={i} className="rounded-md border p-3 space-y-1">
                        <div className="font-medium">{r.condition}</div>
                        <KeyValue label="Lineage" value={r.lineage} />
                        <KeyValue label="Risk level" value={r.risk_level} />
                        {r.action_steps && <div><div className="text-[13px] text-muted-foreground mb-1">Action steps</div><p>{r.action_steps}</p></div>}
                      </li>
                    ))}
                  </ul>
                ) : (<p className="text-muted-foreground">No mitigation items.</p>)}
              </AccordionContent>
            </AccordionItem>

            {/* Preventative screenings & tests */}
            <AccordionItem value="screenings">
              <AccordionTrigger className="justify-between text-left text-[16px] font-semibold py-4">
                <div className="flex items-center gap-3"><Stethoscope className="h-5 w-5 text-[#C85A2E]"/> Preventative screenings & tests</div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-4 text-[15px] leading-6">
                {blueprint?.screening_preventive_testing_roadmap?.length ? (
                  <ul className="space-y-3">
                    {blueprint.screening_preventive_testing_roadmap.map((t, i) => (
                      <li key={i} className="rounded-lg border p-3">
                        <div className="font-medium">{t.test_or_screening}</div>
                        <div className="text-[13px] text-muted-foreground mt-1">Start age: {t.start_age ?? "-"} • Frequency: {t.frequency ?? "-"}</div>
                        {t.notes && <p className="mt-2">{t.notes}</p>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No screening items.</p>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Nutrition (Nourish your decade) */}
            <AccordionItem value="nourish">
              <AccordionTrigger className="justify-between text-left text-[16px] font-semibold py-4">
                <div className="flex items-center gap-3"><Salad className="h-5 w-5 text-[#C85A2E]"/> 50's — Nourish your decade</div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-4 text-[15px] leading-6">
                {blueprint?.nutritional_strategy_supplementation ? (
                  <div className="space-y-4">
                    <KeyValue label="Diet focus" value={blueprint.nutritional_strategy_supplementation.diet_focus} />
                    <div>
                      <div className="text-muted-foreground text-[13px] mb-1">Emphasize</div>
                      <BulletList items={blueprint.nutritional_strategy_supplementation.emphasize} />
                    </div>
                    <div>
                      <div className="text-muted-foreground text-[13px] mb-1">Limit</div>
                      <BulletList items={blueprint.nutritional_strategy_supplementation.limit} />
                    </div>
                    {blueprint.nutritional_strategy_supplementation.targeted_supplements?.length ? (
                      <div>
                        <div className="text-muted-foreground text-[13px] mb-1">Targeted supplements</div>
                        <ul className="space-y-2">
                          {blueprint.nutritional_strategy_supplementation.targeted_supplements.map((s, i) => (
                            <li key={i} className="rounded-md border p-3">
                              <div className="font-medium">{s.supplement}</div>
                              <div className="text-[13px] text-muted-foreground">{s.purpose}</div>
                              {s.dose && <div className="mt-1">Dose: {s.dose}</div>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No nutrition plan.</p>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Fitness & hormones */}
            <AccordionItem value="fitness">
              <AccordionTrigger className="justify-between text-left text-[16px] font-semibold py-4">
                <div className="flex items-center gap-3"><Heart className="h-5 w-5 text-[#C85A2E]"/> Fitness & hormones</div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-4 text-[15px] leading-6">
                {blueprint?.fitness_recovery_lifestyle ? (
                  <div className="space-y-3">
                    {blueprint.fitness_recovery_lifestyle.exercise_plan?.strength_training && (
                      <KeyValue label="Strength" value={blueprint.fitness_recovery_lifestyle.exercise_plan.strength_training} />
                    )}
                    {blueprint.fitness_recovery_lifestyle.exercise_plan?.cardio && (
                      <KeyValue label="Cardio" value={blueprint.fitness_recovery_lifestyle.exercise_plan.cardio} />
                    )}
                    {blueprint.fitness_recovery_lifestyle.exercise_plan?.pilates_stretch_mobility && (
                      <KeyValue label="Mobility" value={blueprint.fitness_recovery_lifestyle.exercise_plan.pilates_stretch_mobility} />
                    )}
                    {blueprint.fitness_recovery_lifestyle.hormone_monitoring?.length ? (
                      <div>
                        <div className="text-muted-foreground text-[13px] mb-1">Hormone monitoring</div>
                        <BulletList items={blueprint.fitness_recovery_lifestyle.hormone_monitoring} />
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No fitness info.</p>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Sleep & stress */}
            <AccordionItem value="sleep">
              <AccordionTrigger className="justify-between text-left text-[16px] font-semibold py-4">
                <div className="flex items-center gap-3"><Moon className="h-5 w-5 text-[#C85A2E]"/> Sleep & stress</div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-4 text-[15px] leading-6">
                {blueprint?.cognitive_emotional_health?.mental_wellness?.length ? (
                  <BulletList items={blueprint.cognitive_emotional_health.mental_wellness} />
                ) : (
                  <p className="text-muted-foreground">No sleep/stress items.</p>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Cognitive & emotional health (neuroprotection + supplements) */}
            <AccordionItem value="cog">
              <AccordionTrigger className="justify-between text-left text-[16px] font-semibold py-4">
                <div className="flex items-center gap-3"><Brain className="h-5 w-5 text-[#C85A2E]"/> Cognitive & emotional health</div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-4 text-[15px] leading-6 space-y-4">
                {((blueprint as any)?.cognitive_emotional_health)?.neuroprotection?.length ? (
                  <div>
                    <div className="text-muted-foreground text-[13px] mb-1">Neuroprotection</div>
                    <BulletList items={((blueprint as any).cognitive_emotional_health.neuroprotection)} />
                  </div>
                ) : null}
                {((blueprint as any)?.cognitive_emotional_health)?.supplements?.length ? (
                  <div>
                    <div className="text-muted-foreground text-[13px] mb-1">Supplements</div>
                    <BulletList items={((blueprint as any).cognitive_emotional_health.supplements)} />
                  </div>
                ) : null}
                {!((blueprint as any)?.cognitive_emotional_health) && <p className="text-muted-foreground">No items.</p>}
              </AccordionContent>
            </AccordionItem>

            {/* Longevity & healthspan */}
            <AccordionItem value="longevity">
              <AccordionTrigger className="justify-between text-left text-[16px] font-semibold py-4">
                <div className="flex items-center gap-3"><Brain className="h-5 w-5 text-[#C85A2E]"/> Longevity & healthspan</div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-4 text-[15px] leading-6">
                <BulletList items={blueprint?.personalized_preventive_considerations} />
              </AccordionContent>
            </AccordionItem>

            {/* Health action timeline */}
            <AccordionItem value="timeline">
              <AccordionTrigger className="justify-between text-left text-[16px] font-semibold py-4">
                <div className="flex items-center gap-3"><Calendar className="h-5 w-5 text-[#C85A2E]"/> Health action timeline</div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-4 text-[15px] leading-6">
                {(blueprint as any)?.health_action_timeline?.length ? (
                  <ol className="relative border-l pl-5">
                    {(blueprint as any).health_action_timeline.map((t: any, i: number) => (
                      <li key={i} className="mb-4 ml-1">
                        <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-[#C85A2E]" />
                        <div className="font-semibold">{t.period ?? `Phase ${i+1}`}</div>
                        {t.actions?.length ? <BulletList items={t.actions} /> : null}
                      </li>
                    ))}
                  </ol>
                ) : (<p className="text-muted-foreground">No timeline.</p>)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
