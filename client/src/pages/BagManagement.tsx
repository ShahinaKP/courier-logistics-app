import { useEffect, useState } from "react";
import {
  fetchBags,
  fetchPackages,
  createBag,
  addPackageToBag,
  updateBagStatus,
} from "../api/api";
import type { Bag, Package } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const directions = ["north", "south", "east", "west", "central"];

const BagManagement = () => {
  const [bags, setBags] = useState<Bag[]>([]);
  const [unbagged, setUnbagged] = useState<Package[]>([]);
  const [direction, setDirection] = useState("north");
  const [regionId, setRegionId] = useState("1");
  const [selectedBag, setSelectedBag] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");

  const load = () => {
    fetchBags().then(setBags);
    fetchPackages().then((d) => setUnbagged(d.dashboard.unbagged));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateBag = async () => {
    await createBag({ region_id: parseInt(regionId), direction });
    load();
  };

  const handleAddPackage = async () => {
    if (!selectedBag || !selectedPackage) return;
    await addPackageToBag(parseInt(selectedBag), parseInt(selectedPackage));
    load();
  };

  const handleDelay = async (bagId: number) => {
    const reason = prompt("Enter delay reason:");
    if (!reason) return;
    await updateBagStatus(bagId, { status: "delayed", delay_reason: reason });
    load();
  };

  const statusColor: Record<string, string> = {
    open: "bg-green-100 text-green-700",
    delayed: "bg-red-100 text-red-700",
    sealed: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Bag Management</h1>
        <p className="mt-2 text-muted-foreground">
          Create and manage sealed bags for outgoing packages.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Create New Bag */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create New Bag</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Direction</Label>
              <Select value={direction} onValueChange={setDirection}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {directions.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
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
            <Button className="w-full" onClick={handleCreateBag}>
              Create Bag
            </Button>
          </CardContent>
        </Card>

        {/* Add Package to Bag */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add Package to Bag</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Bag</Label>
              <Select value={selectedBag} onValueChange={setSelectedBag}>
                <SelectTrigger>
                  <SelectValue placeholder="-- select bag --" />
                </SelectTrigger>
                <SelectContent>
                  {bags.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {b.bag_code} ({b.direction})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Package</Label>
              <Select
                value={selectedPackage}
                onValueChange={setSelectedPackage}
              >
                <SelectTrigger>
                  <SelectValue placeholder="-- select package --" />
                </SelectTrigger>
                <SelectContent>
                  {unbagged.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.tracking_id.slice(0, 8)}... — {p.sender_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleAddPackage}>
              Add to Bag
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bags Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            All Bags
            <span className="text-sm font-normal text-muted-foreground">
              {bags.length} bags
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bags.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No bags created yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    {[
                      "Bag Code",
                      "Direction",
                      "Status",
                      "Packages",
                      "Actions",
                    ].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bags.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs">
                        {b.bag_code}
                      </td>
                      <td className="px-4 py-3 capitalize">{b.direction}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[b.status] || "bg-slate-100 text-slate-700"}`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{b.package_count}</td>
                      <td className="px-4 py-3">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelay(b.id)}
                        >
                          Mark Delayed
                        </Button>
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

export default BagManagement;
