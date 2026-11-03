"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { useAsync } from "@/hooks/useAsync";
import type { PropertyType } from "@/services/properties";
import {
  PRIORITY_LEVELS,
  VIBE_PREFERENCES,
  createProfile,
  getMyProfile,
  getPropertyTypes,
  updateProfile,
  type NewProfileData,
  type PriorityLevel,
  type StudentProfile,
  type VibePreference,
} from "@/services/studentProfile";
import { cx } from "@/utils/classNames";

import { capitalize, priorityLabels, vibeLabels } from "./profileLabels";
import styles from "./PreferencesForm.module.css";

interface FormValues {
  university: string;
  maxBudget: string;
  maxDistanceToCampus: string;
  safetyPriority: string;
  nightlifePriority: string;
  amenitiesPriority: string;
  vibePreference: string;
  desiredStayMonths: string;
  preferredPropertyTypeId: string;
  minBedrooms: string;
  minBathrooms: string;
  petFriendly: boolean;
}

type TextField = Exclude<keyof FormValues, "petFriendly">;
type FormErrors = Partial<Record<TextField, string>>;

interface Feedback {
  type: "success" | "error";
  message: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export interface PreferencesFormProps {
  profile: StudentProfile | null;
  onSaved: (profile: StudentProfile) => void;
}

const priorityOptions: SelectOption[] = PRIORITY_LEVELS.map((level) => ({
  value: level,
  label: priorityLabels[level],
}));

const vibeOptions: SelectOption[] = VIBE_PREFERENCES.map((vibe) => ({
  value: vibe,
  label: vibeLabels[vibe],
}));

function toFormValues(profile: StudentProfile | null): FormValues {
  if (!profile) {
    return {
      university: "",
      maxBudget: "",
      maxDistanceToCampus: "",
      safetyPriority: "media",
      nightlifePriority: "media",
      amenitiesPriority: "media",
      vibePreference: "equilibrado",
      desiredStayMonths: "",
      preferredPropertyTypeId: "",
      minBedrooms: "0",
      minBathrooms: "0",
      petFriendly: false,
    };
  }

  return {
    university: profile.university,
    maxBudget: String(profile.maxBudget),
    maxDistanceToCampus: String(profile.maxDistanceToCampus),
    safetyPriority: profile.safetyPriority,
    nightlifePriority: profile.nightlifePriority,
    amenitiesPriority: profile.amenitiesPriority,
    vibePreference: profile.vibePreference,
    desiredStayMonths:
      profile.desiredStayMonths === null
        ? ""
        : String(profile.desiredStayMonths),
    preferredPropertyTypeId:
      profile.preferredPropertyTypeId === null
        ? ""
        : String(profile.preferredPropertyTypeId),
    minBedrooms: String(profile.minBedrooms),
    minBathrooms: String(profile.minBathrooms),
    petFriendly: profile.petFriendly,
  };
}

function parseWholeNumber(text: string): number | null {
  const digits = text.trim().replace(/[.\s]/g, "");

  if (!/^\d+$/.test(digits)) {
    return null;
  }

  return Number(digits);
}

function isPriorityLevel(value: string): value is PriorityLevel {
  return PRIORITY_LEVELS.some((level) => level === value);
}

function isVibePreference(value: string): value is VibePreference {
  return VIBE_PREFERENCES.some((vibe) => vibe === value);
}

function validateForm(values: FormValues): {
  errors: FormErrors;
  data: NewProfileData | null;
} {
  const errors: FormErrors = {};

  const university = values.university.trim();
  if (!university) {
    errors.university = "Escribe el nombre de tu universidad.";
  }

  const maxBudget = parseWholeNumber(values.maxBudget);
  if (maxBudget === null || maxBudget <= 0) {
    errors.maxBudget = "El presupuesto debe ser un número mayor que 0.";
  }

  const maxDistanceToCampus = parseWholeNumber(values.maxDistanceToCampus);
  if (maxDistanceToCampus === null || maxDistanceToCampus <= 0) {
    errors.maxDistanceToCampus =
      "La distancia debe ser un número de metros mayor que 0.";
  }

  const { safetyPriority, nightlifePriority, amenitiesPriority } = values;
  if (!isPriorityLevel(safetyPriority)) {
    errors.safetyPriority = "Elige alta, media o baja.";
  }
  if (!isPriorityLevel(nightlifePriority)) {
    errors.nightlifePriority = "Elige alta, media o baja.";
  }
  if (!isPriorityLevel(amenitiesPriority)) {
    errors.amenitiesPriority = "Elige alta, media o baja.";
  }

  const { vibePreference } = values;
  if (!isVibePreference(vibePreference)) {
    errors.vibePreference = "Elige una de las vibras de la lista.";
  }

  let desiredStayMonths: number | null = null;
  if (values.desiredStayMonths.trim() !== "") {
    desiredStayMonths = parseWholeNumber(values.desiredStayMonths);
    if (desiredStayMonths === null || desiredStayMonths < 1) {
      errors.desiredStayMonths =
        "La estancia debe ser un número entero de 1 mes o más.";
    }
  }

  const preferredPropertyTypeId =
    values.preferredPropertyTypeId === ""
      ? null
      : Number(values.preferredPropertyTypeId);

  const minBedrooms = parseWholeNumber(values.minBedrooms);
  if (minBedrooms === null) {
    errors.minBedrooms = "Escribe un número entero de 0 o más.";
  }

  const minBathrooms = parseWholeNumber(values.minBathrooms);
  if (minBathrooms === null) {
    errors.minBathrooms = "Escribe un número entero de 0 o más.";
  }

  if (
    Object.keys(errors).length > 0 ||
    maxBudget === null ||
    maxDistanceToCampus === null ||
    minBedrooms === null ||
    minBathrooms === null ||
    !isPriorityLevel(safetyPriority) ||
    !isPriorityLevel(nightlifePriority) ||
    !isPriorityLevel(amenitiesPriority) ||
    !isVibePreference(vibePreference)
  ) {
    return { errors, data: null };
  }

  return {
    errors,
    data: {
      university,
      maxBudget,
      maxDistanceToCampus,
      safetyPriority,
      nightlifePriority,
      amenitiesPriority,
      vibePreference,
      desiredStayMonths,
      preferredPropertyTypeId,
      minBedrooms,
      minBathrooms,
      petFriendly: values.petFriendly,
    },
  };
}

interface SelectFieldProps {
  id: TextField;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  error,
  hint,
  disabled,
}: SelectFieldProps) {
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cx(styles.select, error && styles.selectError)}
        aria-invalid={Boolean(error)}
        aria-describedby={message ? messageId : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {message ? (
        <p
          id={messageId}
          className={error ? styles.fieldError : styles.fieldHint}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

export function PreferencesForm({ profile, onSaved }: PreferencesFormProps) {
  const [values, setValues] = useState<FormValues>(() =>
    toFormValues(profile),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const propertyTypesQuery = useAsync(getPropertyTypes, "property-types");

  const isEditing = profile !== null;

  const availableTypes: PropertyType[] =
    propertyTypesQuery.data ??
    (profile?.preferredPropertyType ? [profile.preferredPropertyType] : []);

  const propertyTypeOptions: SelectOption[] = [
    { value: "", label: "Sin preferencia" },
    ...availableTypes.map((type) => ({
      value: String(type.id),
      label: capitalize(type.name),
    })),
  ];

  const propertyTypeHint =
    propertyTypesQuery.status === "loading"
      ? "Cargando tipos de vivienda..."
      : propertyTypesQuery.status === "error"
        ? "No se pudieron cargar los tipos de vivienda."
        : undefined;

  function updateField(field: TextField) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = event.target;
      setValues((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    };
  }

  function handlePetFriendlyChange(event: ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;
    setValues((current) => ({ ...current, petFriendly: checked }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const result = validateForm(values);
    setErrors(result.errors);

    if (!result.data) {
      setFeedback({
        type: "error",
        message: "Revisa los campos marcados en rojo.",
      });
      return;
    }

    setSaving(true);

    try {
      const saved = profile
        ? await updateProfile(profile.id, result.data)
        : await createProfile(result.data);
      const refreshed = await getMyProfile().catch(() => null);

      onSaved(refreshed ?? saved);
      setFeedback({
        type: "success",
        message: isEditing
          ? "Tus preferencias se guardaron correctamente."
          : "Tu perfil se creó correctamente.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error && error.message
            ? error.message
            : "No se pudieron guardar los cambios.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <fieldset className={styles.group} disabled={saving}>
        <legend className={styles.legend}>Datos básicos</legend>
        <div className={styles.grid}>
          <InputText
            id="university"
            name="university"
            label="Universidad"
            placeholder="Ej. Universidad Nacional"
            value={values.university}
            onChange={updateField("university")}
            error={errors.university}
          />
          <InputText
            id="maxBudget"
            name="maxBudget"
            label="Presupuesto máximo (COP al mes)"
            placeholder="Ej. 1300000"
            inputMode="numeric"
            value={values.maxBudget}
            onChange={updateField("maxBudget")}
            error={errors.maxBudget}
          />
          <InputText
            id="maxDistanceToCampus"
            name="maxDistanceToCampus"
            label="Distancia máxima al campus (metros)"
            placeholder="Ej. 800"
            inputMode="numeric"
            value={values.maxDistanceToCampus}
            onChange={updateField("maxDistanceToCampus")}
            error={errors.maxDistanceToCampus}
          />
        </div>
      </fieldset>

      <fieldset className={styles.group} disabled={saving}>
        <legend className={styles.legend}>Prioridades y vibra</legend>
        <div className={styles.grid}>
          <SelectField
            id="safetyPriority"
            label="Seguridad"
            value={values.safetyPriority}
            options={priorityOptions}
            onChange={updateField("safetyPriority")}
            error={errors.safetyPriority}
          />
          <SelectField
            id="nightlifePriority"
            label="Vida nocturna"
            value={values.nightlifePriority}
            options={priorityOptions}
            onChange={updateField("nightlifePriority")}
            error={errors.nightlifePriority}
          />
          <SelectField
            id="amenitiesPriority"
            label="Amenidades"
            value={values.amenitiesPriority}
            options={priorityOptions}
            onChange={updateField("amenitiesPriority")}
            error={errors.amenitiesPriority}
          />
          <SelectField
            id="vibePreference"
            label="Vibra del barrio"
            value={values.vibePreference}
            options={vibeOptions}
            onChange={updateField("vibePreference")}
            error={errors.vibePreference}
          />
        </div>
      </fieldset>

      <fieldset className={styles.group} disabled={saving}>
        <legend className={styles.legend}>Vivienda ideal</legend>
        <div className={styles.grid}>
          <SelectField
            id="preferredPropertyTypeId"
            label="Tipo de vivienda"
            value={values.preferredPropertyTypeId}
            options={propertyTypeOptions}
            onChange={updateField("preferredPropertyTypeId")}
            hint={propertyTypeHint}
            disabled={propertyTypesQuery.status === "loading"}
          />
          <InputText
            id="desiredStayMonths"
            name="desiredStayMonths"
            label="Estancia deseada (meses)"
            placeholder="Opcional"
            inputMode="numeric"
            value={values.desiredStayMonths}
            onChange={updateField("desiredStayMonths")}
            error={errors.desiredStayMonths}
          />
          <InputText
            id="minBedrooms"
            name="minBedrooms"
            label="Habitaciones mínimas"
            inputMode="numeric"
            value={values.minBedrooms}
            onChange={updateField("minBedrooms")}
            error={errors.minBedrooms}
          />
          <InputText
            id="minBathrooms"
            name="minBathrooms"
            label="Baños mínimos"
            inputMode="numeric"
            value={values.minBathrooms}
            onChange={updateField("minBathrooms")}
            error={errors.minBathrooms}
          />
        </div>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            name="petFriendly"
            checked={values.petFriendly}
            onChange={handlePetFriendlyChange}
          />
          Necesito un lugar que acepte mascotas
        </label>
      </fieldset>

      <div className={styles.actions}>
        <Button type="submit" variant="accent" loading={saving}>
          {saving
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Crear mi perfil"}
        </Button>

        {feedback ? (
          <p
            className={cx(
              styles.feedback,
              feedback.type === "success" ? styles.success : styles.error,
            )}
            role={feedback.type === "error" ? "alert" : "status"}
          >
            {feedback.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
