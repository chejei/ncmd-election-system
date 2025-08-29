import { useState, useRef } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function VoterLogin() {
  const [lastName, setLastName] = useState("");
  const [pinDigits, setPinDigits] = useState(["", "", "", "", "", ""]); // 6-digit PIN
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newDigits = [...pinDigits];
      newDigits[index] = value;
      setPinDigits(newDigits);

      // Auto move to next input
      if (value && index < pinDigits.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const pin = pinDigits.join("");

    if (pin.length !== 6) {
      setError("PIN must be 6 digits.");
      return;
    }

    try {
      const res = await axios.post("/voter/login", {
        last_name: lastName,
        pin_code: pin,
      });

      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data.voter));
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        navigate("/vote");
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const allErrors = Object.values(error.response.data.errors).flat();
        const errorList = `<ul style="text-align: left;">${allErrors
          .map((err) => `<li>${err}</li>`)
          .join("")}</ul>`;
        setError(errorList);
      } else {
        setError(error.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen">
        <div className="w-full bg-white rounded-lg shadow sm:max-w-md p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-4">
            Voter Login
          </h1>

          {error && (
            <div className="small-text text-red-500 mb-3">
              <div dangerouslySetInnerHTML={{ __html: error }} />
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Last Name
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2.5"
                required
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                6-Digit PIN
              </label>
              <div className="flex gap-3">
                {pinDigits.map((digit, index) => (
                  <input
                    key={index}
                    type="password"
                    placeholder="⚬"
                    maxLength="1"
                    value={digit}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center border rounded-lg text-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white rounded-lg py-2.5 font-medium hover:bg-blue-600"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
