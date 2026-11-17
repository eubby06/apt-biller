import React, { useState } from "react";
import Button from "./Button";
import type { TenantFormData } from "./types";

interface Unit {
  name: string;
  value: number;
}

interface Plan {
  name: string;
  value: string;
}

const INPUT_CLASSES =
  "block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm";
const LABEL_CLASSES = "block text-sm font-medium text-slate-700 mb-1";

const UNITS: Unit[] = [
  { name: "Unit 1", value: 1 },
  { name: "Unit 2", value: 2 },
  { name: "Unit 3", value: 3 },
  { name: "Unit 4", value: 4 },
  { name: "Unit 5", value: 5 },
  { name: "Unit 6", value: 6 },
  { name: "Unit 7", value: 7 },
  { name: "Unit 8", value: 8 },
];

const PLANS: Plan[] = [
  { name: "High Speed", value: "high_speed" },
  { name: "Low Speed", value: "low_speed" },
];

interface TenantFormProps {
  initialData?: TenantFormData;
  onSubmit: (data: TenantFormData) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

const App: React.FC<TenantFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = "save",
}) => {
  const [name, setName] = useState(initialData?.name ?? "");
  const [unit, setUnit] = useState(initialData?.unit ?? 1);
  const [moveInDate, setMoveInDate] = useState(
    initialData?.move_in_date ?? null,
  );
  const [totalHeads, setTotalHeads] = useState(initialData?.total_heads ?? 1);
  const [rentAmount, setRentAmount] = useState(
    initialData?.rent_amount ?? 6000,
  );
  const [internetPlan, setInternetPlan] = useState(
    initialData?.internet_plan ?? "low_speed",
  );

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      name: name,
      unit: Number(unit),
      move_in_date: moveInDate,
      total_heads: Number(totalHeads),
      rent_amount: Number(rentAmount),
      internet_plan: internetPlan,
    });
  };

  return (
    <>
      <div className="w-full mx-auto p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <div>
            <label htmlFor="name" className={LABEL_CLASSES}>
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT_CLASSES}
            />
          </div>

          <div>
            <label htmlFor="tenant" className={LABEL_CLASSES}>
              Unit Number
            </label>
            <select
              id="tenant"
              required
              value={unit}
              onChange={(e) => {
                setUnit(Number(e.target.value));
              }}
              disabled={isSubmitting}
              className={INPUT_CLASSES}
            >
              <option value="" disabled>
                Select a unit
              </option>
              {UNITS.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="move_in_date" className={LABEL_CLASSES}>
              Due Date
            </label>
            <input
              id="move_in_date"
              type="date"
              required
              value={moveInDate ?? ""}
              onChange={(e) => setMoveInDate(e.target.value)}
              className={INPUT_CLASSES}
            />
          </div>

          <div>
            <label htmlFor="rent_amount" className={LABEL_CLASSES}>
              Rent Amount
            </label>
            <input
              id="rent_amount"
              type="number"
              min="0"
              required
              value={rentAmount}
              onChange={(e) => setRentAmount(Number(e.target.value))}
              className={INPUT_CLASSES}
            />
          </div>

          <div>
            <label htmlFor="total_heads" className={LABEL_CLASSES}>
              Total Heads
            </label>
            <input
              id="total_heads"
              type="number"
              min={totalHeads || "1"}
              required
              value={totalHeads}
              onChange={(e) => setTotalHeads(Number(e.target.value))}
              className={INPUT_CLASSES}
            />
          </div>

          <div>
            <label htmlFor="tenant" className={LABEL_CLASSES}>
              Internet Plan
            </label>
            <select
              id="internet_plan"
              required
              value={internetPlan}
              onChange={(e) => {
                setInternetPlan(e.target.value);
              }}
              disabled={isSubmitting}
              className={INPUT_CLASSES}
            >
              <option value="" disabled>
                Select a unit
              </option>
              {PLANS.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </form>
      </div>
    </>
  );
};

export default App;
