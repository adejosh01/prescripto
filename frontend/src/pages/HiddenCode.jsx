// import React from 'react';
// import InputField from './InputField';
// import PasswordStrengthIndicator from './PasswordStrengthIndicator';
// import Button from './Button';

// interface AccountCreationFormProps {
//   onSubmit: (formData: FormData) => void;
// }

// interface FormData {
//   firstName: string;
//   lastName: string;
//   businessName: string;
//   workEmail: string;
//   password: string;
// }

// const AccountCreationForm: React.FC<AccountCreationFormProps> = ({ onSubmit }) => {
//   const [formData, setFormData] = React.useState<FormData>({
//     firstName: '',
//     lastName: '',
//     businessName: '',
//     workEmail: '',
//     password: '',
//   });

//   const handleInputChange = (name: keyof FormData, value: string) => {
//     setFormData(prevData => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col p-6 rounded-3xl border border-gray-200 border-solid bg-[color:var(--sds-color-background-default-default)] max-w-[588px] max-md:px-5">
//       <header className="flex flex-col self-end w-full text-center">
//         <h1 className="text-2xl font-semibold tracking-tight leading-none text-stone-800 max-md:max-w-full">
//           Create your Ingenium account
//         </h1>
//         <p className="self-center mt-2 text-sm tracking-normal leading-6 text-stone-500 max-md:max-w-full">
//           Fill details below to create your account
//         </p>
//       </header>
//       <main className="flex flex-col mt-6 w-full max-md:max-w-full">
//         <div className="flex flex-wrap gap-3 items-center w-full tracking-normal max-md:max-w-full">
//           <InputField
//             label="First name"
//             name="firstName"
//             value={formData.firstName}
//             onChange={(value) => handleInputChange('firstName', value)}
//           />
//           <InputField
//             label="Last name"
//             name="lastName"
//             value={formData.lastName}
//             onChange={(value) => handleInputChange('lastName', value)}
//           />
//         </div>
//         <InputField
//           label="Business name"
//           name="businessName"
//           value={formData.businessName}
//           onChange={(value) => handleInputChange('businessName', value)}
//         />
//         <InputField
//           label="Work email"
//           name="workEmail"
//           type="email"
//           value={formData.workEmail}
//           onChange={(value) => handleInputChange('workEmail', value)}
//         />
//         <InputField
//           label="Choose a password"
//           name="password"
//           type="password"
//           value={formData.password}
//           onChange={(value) => handleInputChange('password', value)}
//         />
//         <PasswordStrengthIndicator password={formData.password} />
//         <div className="flex flex-col mt-3 w-full text-sm tracking-normal leading-none max-md:max-w-full">
//           <p className="leading-6 text-xs tracking-normal text-gray-500 max-md:max-w-full">
//             By submitting this form, you consent to receive emails from Ingenium about various updates, with the option to unsubscribe anytime. For questions, contact{" "}
//             <a href="mailto:hello@ingenium.com" className="font-medium underline">hello@ingenium.com</a>
//             {" "}View our{" "}
//             <a href="/privacy-policy" className="font-medium underline">Privacy Policy.</a>
//           </p>
//           <Button type="submit" className="mt-5">Continue</Button>
//           <p className="mt-5 text-center">
//             Already have an account? <a href="/login" className="text-blue-600 underline">Log in</a>
//           </p>
//         </div>
//       </main>
//     </form>
//   );
// };

// export default AccountCreationForm;



// import React from 'react';

// interface InputFieldProps {
//   label: string;
//   name: string;
//   value: string;
//   onChange: (value: string) => void;
//   type?: string;
// }

// const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text' }) => {
//   return (
//     <div className="flex flex-col flex-1 shrink self-stretch my-auto basis-0 min-w-[240px]">
//       <label htmlFor={name} className="gap-0.5 self-stretch w-full font-medium text-stone-800 text-sm">
//         {label}
//       </label>
//       <input
//         id={name}
//         name={name}
//         type={type}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="flex gap-2.5 items-start p-2.5 mt-2 w-full whitespace-nowrap bg-white rounded-xl border border-solid border-neutral-300 text-stone-900"
//       />
//     </div>
//   );
// };

// export default InputField;


// import React from 'react';

// interface PasswordStrengthIndicatorProps {
//   password: string;
// }

// const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
//   const getStrength = (): { width: string; text: string } => {
//     if (password.length === 0) return { width: '0%', text: '' };
//     if (password.length < 8) return { width: '25%', text: 'Weak' };
//     if (password.length < 12) return { width: '50%', text: 'Medium' };
//     return { width: '100%', text: 'Strong' };
//   };

//   const { width, text } = getStrength();

//   return (
//     <div className="flex flex-col py-2 mt-3 w-full max-md:max-w-full">
//       <div className="flex overflow-hidden flex-col items-start w-full rounded-xl bg-zinc-100 max-md:pr-5 max-md:max-w-full">
//         <div className="flex shrink-0 h-2.5 bg-amber-400" style={{ width }} />
//       </div>
//       <div className="flex flex-wrap gap-10 justify-between items-start mt-1.5 w-full text-sm tracking-normal text-zinc-600 max-md:max-w-full">
//         <div className="leading-6 w-[241px]">
//           Your password must contain:
//           <br />a symbol
//           <br />an uppercase letter
//           <br />a number
//           <br />8 characters minimum
//         </div>
//         <div className="font-medium leading-none text-right">
//           {text}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PasswordStrengthIndicator;


// import React from 'react';

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   children: React.ReactNode;
// }

// const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
//   return (
//     <button
//       className={`flex overflow-hidden gap-2 justify-center items-center px-3 py-2.5 w-full font-medium tracking-normal text-white whitespace-nowrap bg-sky-500 rounded-xl min-h-[40px] max-md:max-w-full ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// export default Button;