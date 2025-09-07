"use client";
import React, { useState } from "react";
import axios from "axios";
import Map from "../../public/Map.png";
import { useLanguage } from "../context/LanguageContext";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    insuranceType: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [translations, setTranslations] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const texts = {
    toastSuccess: "Message sent successfully!",
    toastNote: "We'll get back to you within 24 hours.",
    bannerTag: "Contact Support",
    bannerTitle: "Get in Touch",
    bannerDesc:
      "We're here to help you find the perfect insurance solution. Contact our experts today for personalized assistance.",
    contactInfoTitle: "Contact Information",
    contactInfoDesc:
      "Get in touch with our insurance experts. We're available 24/7 to assist you with all your insurance needs.",
    emailSupportTitle: "Email Support",
    emailSupportDesc: "Send us an email",
    email1: "info@costaricaninsurance.com",
    //email2: "claims@costaricainsurance.com",
    formTitle: "Send us a Message",
    formDesc:
      "Fill out the form below and our team will get back to you within 24 hours.",
    firstNameLabel: "First Name *",
    firstNamePlaceholder: "John",
    lastNameLabel: "Last Name *",
    lastNamePlaceholder: "Doe",
    emailLabel: "Email Address *",
    emailPlaceholder: "john.doe@example.com",
    phoneLabel: "Phone Number",
    phonePlaceholder: "+1 (555) 123-4567",
    insuranceTypeLabel: "Insurance Type",
    insuranceTypePlaceholder: "Select insurance type",
    insuranceTypeAuto: "Auto Insurance",
    insuranceTypeHome: "Home Insurance",
    insuranceTypeLife: "Life Insurance",
    insuranceTypeHealth: "Health Insurance",
    insuranceTypeBusiness: "Business Insurance",
    insuranceTypeTravel: "Travel Insurance",
    subjectLabel: "Subject *",
    subjectPlaceholder: "How can we help you?",
    messageLabel: "Message *",
    messagePlaceholder: "Please describe your inquiry in detail...",
    privacyTitle: "Your privacy is protected",
    privacyDesc:
      "We use industry-standard encryption to protect your personal information and will never share your data with third parties.",
    submitBtn: "Send Message",
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const fd = new FormData();
  //   Object.entries(formData).forEach(([key, value]) => {
  //     fd.append(key, value);
  //   });

  //   // Required hidden CF7 fields
  //   fd.append("_wpcf7_unit_tag", "wpcf7-f9-p45-o1"); // 👈 replace with actual unit_tag from your CF7 form HTML
  //   fd.append("_wpcf7", "9"); // 👈 replace with your numeric CF7 form ID

  //   try {
  //     const response = await axios.post(
  //       "https://admin.costaricaninsurance.com/wp-json/contact-form-7/v1/contact-forms/170/feedback", // 👈 numeric ID here
  //       fd
  //     );

  //     const data = response.data;
  //     if (data.status === "mail_sent") {
  //       alert("Message sent successfully!");
  //       setFormData({
  //         firstName: "",
  //         lastName: "",
  //         email: "",
  //         phone: "",
  //         subject: "",
  //         message: "",
  //         insuranceType: "",
  //       });
  //     } else if (data.status === "validation_failed") {
  //       console.warn("Validation failed:", data.invalid_fields);
  //     } else {
  //       console.error("Submission error:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error.response?.data || error);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("_wpcf7", "170"); // form ID
    fd.append("_wpcf7_version", "5.9.8");
    fd.append("_wpcf7_locale", "en_US");
    fd.append("_wpcf7_unit_tag", "wpcf7-f170-o1");
    fd.append("_wpcf7_container_post", "123");
    // Map React state -> CF7 field names
    fd.append("your-name", `${formData.firstName} ${formData.lastName}`.trim());
    fd.append("your-email", formData.email);
    fd.append("your-subject", formData.subject);
    fd.append("your-message", formData.message);

    try {
      const response = await axios.post(
        "https://admin.costaricaninsurance.com/wp-json/contact-form-7/v1/contact-forms/170/feedback",
        fd
      );

      if (response.data.status === "mail_sent") {
        alert("Message sent successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          insuranceType: "",
        });
      } else if (response.data.status === "validation_failed") {
        console.warn("Validation failed:", response.data.invalid_fields);
      } else {
        console.error("Submission error:", response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error);
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${Map.src})` }}
      className="min-h-screen  bg-gradient-to-b  bg-contain bg-no-repeat from-background to-muted/30  dark:from-gray-900 dark:to-gray-800 "
    >
      <div className="absolute inset-0 bg-[#fff8ea] animate-pulse  top-[60%] left-[20%] rounded-2xl h-[20px] w-[20px]"></div>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-success text-success-foreground px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-right dark:bg-green-700 dark:text-white">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <p className="font-medium">
                {translations.toastSuccess || "Message sent successfully!"}
              </p>
              <p className="text-sm opacity-90">
                {translations.toastNote ||
                  "We will get back to you within 24 hours."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-gradient-to-r h-[300px]  bg-center from-primary to-accent py-16 dark:from-white/5 dark:to-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center text-primary-foreground dark:text-white">
            <span className="inline-flex items-center gap-1 bg-white text-[#171717] border border-white/30 hover:bg-white/30 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {translations.bannerTag || texts.bannerTag}
            </span>
            <h1 className="text-2xl md:text-3xl font-[Marcellus] font-bold mb-6 dark:text-white">
              {translations.bannerTitle || texts.bannerTitle}
            </h1>
            <p className="text-[14px] md:text-[14px] max-w-3xl mx-auto opacity-90 dark:text-gray-300">
              {translations.bannerDesc || texts.bannerDesc}
            </p>
          </div>
        </div>
      </div>

      <div className="  sm:px-6 lg:px-8   px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-3xl font-bold  font-[Marcellus] mb-6 dark:text-white">
                {translations.contactInfoTitle || texts.contactInfoTitle}
              </h2>
              <p className="text-muted-foreground mb-8 dark:text-gray-300">
                {translations.contactInfoDesc || texts.contactInfoDesc}
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {/* <div className="bg-white border border-slate-200 rounded-2xl border-l-4 border-l-[#f59f0a] hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 bg-[#fef6ea] rounded-lg">
                      <svg
                        className="h-6 w-6 text-[#f59f0a] text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Phone Support
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        Call us directly
                      </p>
                      <p className="font-medium text-[#f59f0a] text-primary">
                        +1 (555) 123-4567
                      </p>
                      <p className="font-medium text-[#f59f0a] text-primary">
                        +1 (555) 987-6543
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="bg-white border dark:bg-white/10 dark:border-gray-800 border-slate-200 rounded-2xl border-l-4 border-l-[#f59f0a] hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 p-3 bg-[#fef6ea] pn:max-ss:hidden rounded-lg ">
                      <svg
                        className="h-6 w-6 text-[#f59f0a] text-accent dark:text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 dark:text-white">
                        {translations.emailSupportTitle ||
                          texts.emailSupportTitle}
                      </h3>
                      <p className="text-muted-foreground mb-2  dark:text-gray-300">
                        {translations.emailSupportDesc ||
                          texts.emailSupportDesc}
                      </p>
                      <p className="font-medium text-[#f59f0a] pn:max-ss:text-[13px]  text-primary  dark:text-yellow-400">
                        {translations.email1 || texts.email1}
                      </p>
                      <p className="font-medium text-[#f59f0a]  pn:max-ss:text-[13px] text-primary dark:text-yellow-400">
                        {translations.email2 || texts.email2}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="bg-white border border-slate-200 rounded-2xl border-l-4 border-l-green-400 hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-50 p-3  rounded-lg">
                      <svg
                        className="h-6 w-6 text-green-400 text-success"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Office Location
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        Visit our main office
                      </p>
                      <p className="font-medium">
                        123 Insurance Ave, Suite 400
                      </p>
                      <p className="font-medium">San José, Costa Rica 10101</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-2xl">
                      <svg
                        className="h-6 w-6 text-[#f59f0a]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Business Hours
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        We're here when you need us
                      </p>
                      <p className="font-medium">
                        Mon - Fri: 8:00 AM - 6:00 PM
                      </p>
                      <p className="font-medium">Saturday: 9:00 AM - 2:00 PM</p>
                      <p className="font-medium">Sunday: Emergency only</p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          {/* Contact Form */}
          <div className="lg:col-span-2 ">
            <div className="bg-white border dark:bg-white/10 border-slate-200 dark:border-gray-700 rounded-3xl">
              <div className="p-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold  font-[Marcellus] mb-4 dark:text-white">
                    {translations.formTitle || texts.formTitle}
                  </h2>
                  <p className="text-muted-foreground dark:text-gray-300">
                    {translations.formDesc || texts.formDesc}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="border p-2 w-full rounded-xl dark:bg-white/10 dark:border-gray-800 dark:text-white"
                  />
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="border p-2 w-full rounded-xl dark:bg-white/10 dark:border-gray-800 dark:text-white"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border p-2 w-full rounded-xl dark:bg-white/10 dark:border-gray-800 dark:text-white"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border p-2 w-full rounded-xl dark:bg-white/10 dark:border-gray-800 dark:text-white"
                  />
                  <input
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="border p-2 w-full rounded-xl dark:bg-white/10 dark:border-gray-800 dark:text-white"
                  />
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    className="border p-2 w-full rounded-xl dark:bg-white/10 dark:border-gray-800 dark:text-white"
                  />
                  <select
                    name="insuranceType"
                    value={formData.insuranceType}
                    onChange={handleChange}
                    className="border p-2 w-full rounded-xl dark:bg-white/10 dark:border-gray-800 dark:text-white"
                  >
                    <option
                      className="dark:bg-white/10 dark:text-black"
                      value=""
                    >
                      Select Insurance
                    </option>
                    <option
                      className="dark:bg-black/10 dark:text-black"
                      value="Auto"
                    >
                      Auto
                    </option>
                    <option
                      className="dark:bg-black/10 dark:text-black"
                      value="Home"
                    >
                      Home
                    </option>
                    <option
                      className="dark:bg-black/10 dark:text-black"
                      value="Life"
                    >
                      Life
                    </option>
                    <option
                      className="dark:bg-black/10 dark:text-black"
                      value="Health"
                    >
                      Health
                    </option>
                  </select>

                  <button
                    type="submit"
                    className="bg-orange-600 text-white p-2 w-full rounded-xl  dark:border-gray-800 dark:text-white"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
