import { supabase } from "../../config/supabase";
import { CandidateScore, WorkerProfile, ServiceRequest } from "../../types";

const FALLBACK_WORKERS: WorkerProfile[] = [
  {
    id: "worker-1",
    workerCode: "W-042",
    name: "Suresh Kumar",
    phone: "+91 98201 12345",
    skills: ["Plumbing", "Pipe Repair"],
    rating: 4.6,
    jobsCompleted: 142,
    societyName: "Shivaji Labour Cooperative Society",
    serviceAreas: ["Thane", "Kalwa", "Majiwada"],
    status: "AVAILABLE",
    availableNow: true,
    yearsOfExperience: 6,
  },
  {
    id: "worker-2",
    workerCode: "W-041",
    name: "Amit Sharma",
    phone: "+91 98200 11223",
    skills: ["Plumbing", "Sanitation"],
    rating: 4.8,
    jobsCompleted: 18,
    societyName: "Shivaji Labour Cooperative Society",
    serviceAreas: ["Thane", "Borivali East", "Kandivali West"],
    status: "AVAILABLE",
    availableNow: true,
    yearsOfExperience: 4,
  },
  {
    id: "worker-3",
    workerCode: "W-043",
    name: "Ramesh Patil",
    phone: "+91 98202 33445",
    skills: ["Electrical", "Wiring"],
    rating: 4.7,
    jobsCompleted: 12,
    societyName: "Dharavi Skilled Workers Federation",
    serviceAreas: ["Kalwa", "Thane West"],
    status: "BUSY",
    availableNow: false,
    yearsOfExperience: 5,
  },
  {
    id: "worker-4",
    workerCode: "W-044",
    name: "Vijay Kumar",
    phone: "+91 98203 44556",
    skills: ["Painting", "Coatings"],
    rating: 4.5,
    jobsCompleted: 6,
    societyName: "Shivaji Labour Cooperative Society",
    serviceAreas: ["Panch Pakhadi", "Thane"],
    status: "AVAILABLE",
    availableNow: true,
    yearsOfExperience: 3,
  },
];

export async function calculateCandidateScores(
  request: ServiceRequest
): Promise<CandidateScore[]> {
  let workers: WorkerProfile[] = [];

  try {
    const { data, error } = await supabase.from("workers").select("*");
    if (!error && data && data.length > 0) {
      workers = data.map((w) => ({
        id: w.id,
        workerCode: w.worker_code,
        name: w.name,
        phone: w.phone,
        skills: w.skills || [],
        rating: Number(w.rating) || 4.5,
        jobsCompleted: w.jobs_completed || 0,
        societyName: w.society_name,
        serviceAreas: w.service_areas || [],
        status: w.status || "AVAILABLE",
        availableNow: Boolean(w.available_now),
        yearsOfExperience: 5,
      }));
    } else {
      workers = FALLBACK_WORKERS;
    }
  } catch (err) {
    workers = FALLBACK_WORKERS;
  }

  const categoryNameLower = request.categoryName.toLowerCase();
  const requestLocalityLower = request.address.locality.toLowerCase();

  const candidateScores: CandidateScore[] = workers.map((worker) => {
    const hasExactSkill = worker.skills.some(
      (s) => s.toLowerCase().includes(categoryNameLower) || categoryNameLower.includes(s.toLowerCase())
    );
    const skillScore = hasExactSkill ? 35 : 15;

    const isAvailableNow = worker.availableNow && worker.status === "AVAILABLE";
    const availabilityScore = isAvailableNow ? 20 : 5;

    const coversLocality = worker.serviceAreas.some(
      (area) => requestLocalityLower.includes(area.toLowerCase()) || area.toLowerCase().includes(requestLocalityLower)
    );
    const locationScore = coversLocality ? 13 : 8;

    const expYears = worker.yearsOfExperience || 4;
    const experienceScore = Math.min(10, Math.round(expYears * 1.5));

    const workloadScore = worker.jobsCompleted > 50 ? 14 : worker.jobsCompleted > 20 ? 17 : 20;

    const totalScore = skillScore + availabilityScore + locationScore + experienceScore + workloadScore;

    const initials = worker.name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();

    return {
      workerId: worker.id,
      workerName: worker.name,
      initials,
      skill: worker.skills[0] || request.categoryName,
      societyName: worker.societyName,
      serviceAreas: worker.serviceAreas,
      rating: worker.rating,
      jobsCompleted: worker.jobsCompleted,
      distanceKm: coversLocality ? 1.5 : 3.8,
      matchScore: totalScore,
      breakdown: {
        skillCompatibility: skillScore,
        availability: availabilityScore,
        locationProximity: locationScore,
        experience: experienceScore,
        workloadFairness: workloadScore,
      },
      criteriaChecklist: {
        skillMatch: hasExactSkill,
        slotAvailable: isAvailableNow,
        areaCovered: coversLocality,
        experienceSufficient: expYears >= 2,
        workloadBalanced: workloadScore >= 14,
      },
    };
  });

  return candidateScores.sort((a, b) => b.matchScore - a.matchScore);
}
