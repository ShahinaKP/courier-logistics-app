const BASE = "http://localhost:5001/api";

export const fetchPackages = () =>
  fetch(`${BASE}/packages`).then((r) => r.json());
export const fetchBags = () => fetch(`${BASE}/bags`).then((r) => r.json());
export const fetchTrucks = () => fetch(`${BASE}/trucks`).then((r) => r.json());
export const fetchSchedules = () =>
  fetch(`${BASE}/trucks/schedules`).then((r) => r.json());

export const createBag = (data: { region_id: number; direction: string }) =>
  fetch(`${BASE}/bags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const addPackageToBag = (bagId: number, package_id: number) =>
  fetch(`${BASE}/bags/${bagId}/packages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ package_id }),
  }).then((r) => r.json());

export const updateBagStatus = (
  bagId: number,
  data: { status: string; delay_reason?: string },
) =>
  fetch(`${BASE}/bags/${bagId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const createSchedule = (data: {
  truck_id: number;
  region_id: number;
  scheduled_departure: string;
}) =>
  fetch(`${BASE}/trucks/schedules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateSchedule = (
  scheduleId: number,
  data: { status: string; delay_reason?: string; actual_departure?: string },
) =>
  fetch(`${BASE}/trucks/schedules/${scheduleId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());
