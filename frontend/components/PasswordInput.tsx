export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = "Mot de passe",
  label = "Mot de passe",
  required = false,
  autoComplete = "current-password",
  error, // Ajout de la gestion des erreurs
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={id} className="text-sm font-medium text-[var(--color-text-muted)] tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-colors duration-200 text-sm"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors duration-200 p-1 focus:outline-none cursor-pointer"
        >
          {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>} {/* Affichage des erreurs */}
    </div>
  );
}