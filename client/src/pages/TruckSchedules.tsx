import { useEffect, useState } from "react";
import {
  fetchTrucks,
  fetchSchedules,
  createSchedule,
  updateSchedule,
} from "../api/api";
import type { Truck, TruckSchedule } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

const TruckSchedules = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [schedules, setSchedules] = useState<TruckSchedule[]>([]);
  const [truckId, setTruckId] = useState("");
  const [regionId, setRegionId] = useState("1");

  const [departure, setDeparture] = useState<Date | null>(new Date());

  const load = () => {
    fetchTrucks().then(setTrucks);
    fetchSchedules().then(setSchedules);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!truckId || !departure) return;
    await createSchedule({
      truck_id: parseInt(truckId),
      region_id: parseInt(regionId),
      scheduled_departure: departure?.toISOString(),
    });
    load();
  };

  const handleDelay = async (scheduleId: number) => {
    const reason = prompt("Enter delay reason:");
    if (!reason) return;
    await updateSchedule(scheduleId, {
      status: "delayed",
      delay_reason: reason,
    });
    load();
  };

  const handleDepart = async (scheduleId: number) => {
    await updateSchedule(scheduleId, {
      status: "departed",
      actual_departure: new Date().toISOString(),
    });
    load();
  };

  const statusColor: Record<string, string> = {
    scheduled: "bg-amber-100 text-amber-700",
    departed: "bg-green-100 text-green-700",
    delayed: "bg-red-100 text-red-700",
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Truck Schedules</h1>
        <p className="mt-2 text-muted-foreground">
          Manage truck departures and delivery schedules.
        </p>
      </div>

      {/* Create Schedule */}
      <Card className="max-w-md overflow-visible">
        <CardHeader>
          <CardTitle className="text-base">Create Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Truck</Label>
            <Select value={truckId} onValueChange={setTruckId}>
              <SelectTrigger>
                <SelectValue placeholder="-- select truck --" />
              </SelectTrigger>
              <SelectContent>
                {trucks.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.truck_code} (cap: {t.capacity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Region ID</Label>
            <Input
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Scheduled Departure</Label>
            <DateTimePicker
              onChange={(value) => setDeparture(value as Date)}
              value={departure}
              format="dd/MM/y h:mm a"
              disableClock
            />
          </div>
          <Button className="w-full" onClick={handleCreate}>
            Create Schedule
          </Button>
        </CardContent>
      </Card>

      {/* Schedules Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            All Schedules
            <span className="text-sm font-normal text-muted-foreground">
              {schedules.length} schedules
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No schedules created yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    {[
                      "Truck",
                      "Region",
                      "Scheduled",
                      "Status",
                      "Bags",
                      "Actions",
                    ].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {schedules.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{s.truck_code}</td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">
                          {s.region_code}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(s.scheduled_departure).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[s.status] || "bg-slate-100 text-slate-700"}`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{s.bag_count}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelay(s.id)}
                          >
                            Delay
                          </Button>
                          <Button size="sm" onClick={() => handleDepart(s.id)}>
                            Depart
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TruckSchedules;
