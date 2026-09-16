import { useState } from "react";
import api from "../../services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    const newErrors = {};

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    // Name
    if (!name) {
      newErrors.name = "Name is required.";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    } else if (name.length > 50) {
      newErrors.name = "Name cannot exceed 50 characters.";
    } else if (!/^[A-Za-z\s.'-]+$/.test(name)) {
      newErrors.name = "Name can only contain letters and spaces.";
    }

    // Email
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    } else if (email.length > 100) {
      newErrors.email = "Email cannot exceed 100 characters.";
    }

    // Phone - optional
    if (phone) {
      if (!/^[6-9]\d{9}$/.test(phone)) {
        newErrors.phone =
          "Please enter a valid 10-digit Indian mobile number.";
      }
    }

    // Subject
    if (!subject) {
      newErrors.subject = "Subject is required.";
    } else if (subject.length < 3) {
      newErrors.subject = "Subject must be at least 3 characters.";
    } else if (subject.length > 100) {
      newErrors.subject = "Subject cannot exceed 100 characters.";
    }

    // Message
    if (!message) {
      newErrors.message = "Message is required.";
    } else if (message.length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    } else if (message.length > 1000) {
      newErrors.message = "Message cannot exceed 1000 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setSuccess("");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const value = formData[name].trim();

    let error = "";

    if (name === "name") {
      if (!value) {
        error = "Name is required.";
      } else if (value.length < 2) {
        error = "Name must be at least 2 characters.";
      } else if (value.length > 50) {
        error = "Name cannot exceed 50 characters.";
      } else if (!/^[A-Za-z\s.'-]+$/.test(value)) {
        error = "Name can only contain letters and spaces.";
      }
    }

    if (name === "email") {
      if (!value) {
        error = "Email is required.";
      } else if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)
      ) {
        error = "Please enter a valid email address.";
      }
    }

    if (name === "phone" && value) {
      if (!/^[6-9]\d{9}$/.test(value)) {
        error = "Please enter a valid 10-digit Indian mobile number.";
      }
    }

    if (name === "subject") {
      if (!value) {
        error = "Subject is required.";
      } else if (value.length < 3) {
        error = "Subject must be at least 3 characters.";
      } else if (value.length > 100) {
        error = "Subject cannot exceed 100 characters.";
      }
    }

    if (name === "message") {
      if (!value) {
        error = "Message is required.";
      } else if (value.length < 10) {
        error = "Message must be at least 10 characters.";
      } else if (value.length > 1000) {
        error = "Message cannot exceed 1000 characters.";
      }
    }

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      };

      const response = await api.post("/contact", payload);

      setSuccess(
        response?.data?.message ||
          "Thank you for contacting us. We will get back to you shortly."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setErrors({});
    } catch (err) {
      console.error("Contact form error:", err);

      setErrors({
        submit:
          err?.response?.data?.message ||
          "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#070B1A] py-28"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-200px] top-[-150px] h-[550px] w-[550px] rounded-full bg-violet-700/15 blur-[180px]" />

        <div className="absolute bottom-[-150px] left-[-200px] h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[160px]" />
      </div>

      {/* Same Container as other sections */}
      <div className="relative mx-auto w-full max-w-[1440px] px-8 lg:px-12 xl:px-16">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Get In Touch
          </p>

          <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            Have a question?
            <br />

            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              We’re here to help.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-7 text-gray-400">
            Whether you have a question about assessments, certifications,
            payments, or your account, feel free to reach out to us.
          </p>
        </div>

        {/* Main Content */}
        <div className="mx-auto mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">

          {/* Contact Information */}
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">

            <div className="absolute right-[-80px] top-[-80px] h-48 w-48 rounded-full bg-violet-600/10 blur-[80px]" />

            <div className="relative">
              <h3 className="text-2xl font-semibold text-white">
                Let’s talk
              </h3>

              <p className="mt-4 leading-7 text-gray-400">
                Our team is ready to help you with any questions or concerns.
                Send us a message and we’ll get back to you as soon as possible.
              </p>

              <div className="mt-10 space-y-7">

                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    ✉
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email</p>

                    <p className="mt-1 text-gray-200">
                      info@skilium.in
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    ☎
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Phone</p>

                    <p className="mt-1 text-gray-200">
                      +91 00000 00000
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    ◷
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Working Hours
                    </p>

                    <p className="mt-1 text-gray-200">
                      Monday - Saturday
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      10:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Form */}
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl md:p-10">

            <div className="absolute bottom-[-100px] right-[-100px] h-64 w-64 rounded-full bg-cyan-600/10 blur-[100px]" />

            <form
              onSubmit={handleSubmit}
              noValidate
              className="relative space-y-6"
            >

              {/* Name + Email */}
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Name <span className="text-cyan-400">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={50}
                    placeholder="Your name"
                    className={`w-full rounded-xl border bg-[#0B1022] px-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none transition ${
                      errors.name
                        ? "border-red-500/60 focus:ring-2 focus:ring-red-500/10"
                        : "border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                    }`}
                  />

                  {errors.name && (
                    <p className="mt-2 text-xs text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Email <span className="text-cyan-400">*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={100}
                    placeholder="you@example.com"
                    className={`w-full rounded-xl border bg-[#0B1022] px-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none transition ${
                      errors.email
                        ? "border-red-500/60 focus:ring-2 focus:ring-red-500/10"
                        : "border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                    }`}
                  />

                  {errors.email && (
                    <p className="mt-2 text-xs text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

              </div>

              {/* Phone + Subject */}
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    className={`w-full rounded-xl border bg-[#0B1022] px-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none transition ${
                      errors.phone
                        ? "border-red-500/60 focus:ring-2 focus:ring-red-500/10"
                        : "border-white/10 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/10"
                    }`}
                  />

                  {errors.phone && (
                    <p className="mt-2 text-xs text-red-400">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Subject <span className="text-cyan-400">*</span>
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={100}
                    placeholder="How can we help?"
                    className={`w-full rounded-xl border bg-[#0B1022] px-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none transition ${
                      errors.subject
                        ? "border-red-500/60 focus:ring-2 focus:ring-red-500/10"
                        : "border-white/10 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/10"
                    }`}
                  />

                  {errors.subject && (
                    <p className="mt-2 text-xs text-red-400">
                      {errors.subject}
                    </p>
                  )}
                </div>

              </div>

              {/* Message */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Message <span className="text-cyan-400">*</span>
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={6}
                  maxLength={1000}
                  placeholder="Tell us how we can help..."
                  className={`w-full resize-none rounded-xl border bg-[#0B1022] px-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none transition ${
                    errors.message
                      ? "border-red-500/60 focus:ring-2 focus:ring-red-500/10"
                      : "border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                  }`}
                />

                <div className="mt-2 flex justify-between">

                  {errors.message ? (
                    <p className="text-xs text-red-400">
                      {errors.message}
                    </p>
                  ) : (
                    <span />
                  )}

                  <span className="text-xs text-gray-600">
                    {formData.message.length}/1000
                  </span>

                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {errors.submit}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                  {success}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/10 transition hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;