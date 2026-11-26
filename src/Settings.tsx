import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useSettings, useSettingsCreate } from "./useSettings";
import type { Settings } from "./types";

const INPUT_CLASSES =
  "block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm";
const LABEL_CLASSES = "block text-sm font-medium text-slate-700 mb-1";

export default function Settings() {
  const navigation = useNavigate();
  const createSettings = useSettingsCreate();
  const { data: settings, isLoading, isError, error } = useSettings();

  const [waterRateInput, setWaterRate] = useState<number | null>(null);
  const [electricityRateInput, setElectricityRate] = useState<number | null>(
    null,
  );
  const [internetLowSpeedInput, setInternetLowSpeed] = useState<number | null>(
    null,
  );
  const [internetHighSpeedInput, setInternetHighSpeed] = useState<
    number | null
  >(null);
  const [parkingRateInput, setParkingRate] = useState<number | null>(null);

  if (isLoading) return <div>Loading settings...</div>;
  if (isError)
    return <div role="alert">Error loading settings: {error.message}</div>;
  const waterRate = waterRateInput ?? settings?.water_rate ?? 0;
  const electricityRate =
    electricityRateInput ?? settings?.electricity_rate ?? 0;
  const internetLowSpeed =
    internetLowSpeedInput ?? settings?.internet_lowspeed_rate ?? 0;
  const internetHighSpeed =
    internetHighSpeedInput ?? settings?.internet_highspeed_rate ?? 0;
  const parkingRate = parkingRateInput ?? settings?.parking_rate ?? 0;
  const isSubmitting = createSettings.isPending;

  const submitHandler = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: Settings = {
      tenant_id: settings?.tenant_id ?? 0,
      water_rate: waterRate,
      electricity_rate: electricityRate,
      internet_lowspeed_rate: internetLowSpeed,
      internet_highspeed_rate: internetHighSpeed,
      parking_rate: parkingRate,
    };

    createSettings.mutate(payload, {
      onSuccess: () => {
        navigation("/settings");
      },
    });
  };

  return (
    <>
      <div className="flex items-center justify-between pb-3">
        <div>
          <h1 className="text-3xl">Settings</h1>
        </div>
      </div>

      <div className="w-full mx-auto p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
        <form onSubmit={submitHandler} className="max-w-md mx-auto space-y-4">
          <div>
            <label htmlFor="water_rate" className={LABEL_CLASSES}>
              Water Rate
            </label>
            <input
              id="water_rate"
              type="text"
              required
              value={waterRate}
              onChange={(e) => setWaterRate(Number(e.target.value))}
              className={INPUT_CLASSES}
            />
          </div>
          <div>
            <label htmlFor="electricity_rate" className={LABEL_CLASSES}>
              Electricity Rate
            </label>
            <input
              id="electricity_rate"
              type="text"
              required
              value={electricityRate}
              onChange={(e) => setElectricityRate(Number(e.target.value))}
              className={INPUT_CLASSES}
            />
          </div>
          <div>
            <label htmlFor="internet_lowspeed" className={LABEL_CLASSES}>
              Internet Low-speed Rate
            </label>
            <input
              id="internet_lowspeed"
              type="text"
              required
              value={internetLowSpeed}
              onChange={(e) => setInternetLowSpeed(Number(e.target.value))}
              className={INPUT_CLASSES}
            />
          </div>
          <div>
            <label htmlFor="internet_highspeed" className={LABEL_CLASSES}>
              Internet High-speed Rate
            </label>
            <input
              id="internet_highspeed"
              type="text"
              required
              value={internetHighSpeed}
              onChange={(e) => setInternetHighSpeed(Number(e.target.value))}
              className={INPUT_CLASSES}
            />
          </div>
          <div>
            <label htmlFor="parking_rate" className={LABEL_CLASSES}>
              Parking Rate
            </label>
            <input
              id="parking_rate"
              type="text"
              required
              value={parkingRate}
              onChange={(e) => setParkingRate(Number(e.target.value))}
              className={INPUT_CLASSES}
            />
          </div>
          {createSettings.isError && (
            <p role="alert" className="text-sm text-red-600">
              Unable to save settings: {createSettings.error.message}
            </p>
          )}
          <div className="flex flex-row gap-4">
            <Button
              type="button"
              onClick={() => {
                navigation(`/`);
              }}
              className="w-full"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
