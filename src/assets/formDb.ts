export const formDb = [
    {
        id: 1,
        form_name: "Sample Form",
        form_definition: {
            fields: [
                {
                    id: 1,
                    name: "firstName",
                    type: "text",
                    required: true,
                    placeholder: "First Name",
                },
                {
                    id: 2,
                    name: "age",
                    type: "number",
                    placeholder: "Age",
                },
                {
                    id: 3,
                    name: "gender",
                    type: "radio",
                    options: ["Male", "Female", "Other"],
                    placeholder: "Gender",
                },
                {
                    id: 4,
                    name: "bio",
                    type: "textarea",
                    placeholder: "Short Bio",
                },
            ],
        },
    },
    {
        id: 2,
        form_name: "Extended Contact Form",
        form_definition: {
            fields: [
                {
                    id: 1,
                    name: "email",
                    type: "email",
                    required: true,
                    placeholder: "Your Email",
                },
                {
                    id: 2,
                    name: "message",
                    type: "textarea",
                    placeholder: "Your Message",
                },
                {
                    id: 3,
                    name: "contactMethod",
                    type: "select",
                    options: ["Email", "Phone", "Text"],
                    placeholder: "Preferred Contact Method",
                },
                {
                    id: 4,
                    name: "phone",
                    type: "text",
                    placeholder: "Your Phone Number",
                },
                {
                    id: 5,
                    name: "newsletter",
                    type: "checkbox",
                    placeholder: "Subscribe to newsletter?",
                },
            ],
        },
    },
    {
        id: 3,
        form_name: "Comprehensive Survey Form",
        form_definition: {
            fields: [
                {
                    id: 1,
                    name: "satisfaction",
                    type: "select",
                    options: [
                        "Very Satisfied",
                        "Satisfied",
                        "Neutral",
                        "Unsatisfied",
                        "Very Unsatisfied",
                    ],
                    required: true,
                    placeholder: "Satisfaction Level",
                },
                {
                    id: 2,
                    name: "comments",
                    type: "textarea",
                    placeholder: "Additional Comments",
                },
                {
                    id: 3,
                    name: "recommend",
                    type: "radio",
                    options: ["Yes", "No"],
                    placeholder: "Would you recommend us?",
                },
                {
                    id: 4,
                    name: "improvements",
                    type: "textarea",
                    placeholder: "Suggestions for Improvement",
                },
                {
                    id: 5,
                    name: "ageGroup",
                    type: "select",
                    options: ["18-25", "26-35", "36-45", "46-60", "60+"],
                    placeholder: "Age Group",
                },
            ],
        },
    },
    {
        id: 4,
        form_name: "Detailed Registration Form",
        form_definition: {
            fields: [
                {
                    id: 1,
                    name: "username",
                    type: "text",
                    required: true,
                    placeholder: "Username",
                },
                {
                    id: 2,
                    name: "password",
                    type: "password",
                    required: true,
                    placeholder: "Password",
                },
                {
                    id: 3,
                    name: "confirmPassword",
                    type: "password",
                    required: true,
                    placeholder: "Confirm Password",
                },
                {
                    id: 4,
                    name: "email",
                    type: "email",
                    placeholder: "Email",
                },
                {
                    id: 5,
                    name: "fullName",
                    type: "text",
                    placeholder: "Full Name",
                },
                {
                    id: 6,
                    name: "birthDate",
                    type: "date",
                    placeholder: "Date of Birth",
                },
                {
                    id: 7,
                    name: "address",
                    type: "textarea",
                    placeholder: "Address",
                },
                {
                    id: 8,
                    name: "phone",
                    type: "text",
                    placeholder: "Phone Number",
                },
                {
                    id: 9,
                    name: "terms",
                    type: "checkbox",
                    required: true,
                    placeholder: "I agree to the terms and conditions",
                },
            ],
        },
    },
    {
        id: 5,
        form_name: "Advanced Feedback Form",
        form_definition: {
            fields: [
                {
                    id: 1,
                    name: "name",
                    type: "text",
                    placeholder: "Your Name",
                },
                {
                    id: 2,
                    name: "feedback",
                    type: "textarea",
                    required: true,
                    placeholder: "Your Feedback",
                },
                {
                    id: 3,
                    name: "rating",
                    type: "select",
                    options: ["1", "2", "3", "4", "5"],
                    placeholder: "Rating",
                },
                {
                    id: 4,
                    name: "category",
                    type: "select",
                    options: ["Product", "Service", "Website"],
                    placeholder: "Feedback Category",
                },
                {
                    id: 5,
                    name: "improve",
                    type: "textarea",
                    placeholder: "How can we improve?",
                },
                {
                    id: 6,
                    name: "contact",
                    type: "radio",
                    options: ["Yes", "No"],
                    placeholder: "Would you like us to contact you?",
                },
                {
                    id: 7,
                    name: "contactDetails",
                    type: "text",
                    placeholder: "Contact Details (if yes)",
                },
            ],
        },
    },
    //add more forms here
    {
        id: 6,
        form_name: "Simple Contact Form",
        form_definition: {
            fields: [
                {
                    id: 1,
                    name: "name",
                    type: "text",
                    required: true,
                    placeholder: "Your Name",
                },
                {
                    id: 2,
                    name: "email",
                    type: "email",
                    required: true,
                    placeholder: "Your Email",
                },
                {
                    id: 3,
                    name: "message",
                    type: "textarea",
                    placeholder: "Your Message",
                },
            ],
        },
    },
    {
        id: 7,
        form_name: "Basic Survey Form",
        form_definition: {
            fields: [
                {
                    id: 1,
                    name: "rating",
                    type: "select",
                    options: ["1", "2", "3", "4", "5"],
                    required: true,
                    placeholder: "Rating",
                },
                {
                    id: 2,
                    name: "comments",
                    type: "textarea",
                    placeholder: "Additional Comments",
                },
                {
                    id: 3,
                    name: "recommend",
                    type: "radio",
                    options: ["Yes", "No"],
                    placeholder: "Would you recommend us?",
                },
            ],
        },
    },
    {
        id: 8,
        form_name: "Basic Contact Form",
        form_definition: {
            fields: [
                {
                    id: 1,
                    name: "name",
                    type: "text",
                    required: true,
                    placeholder: "Your Name",
                },
                {
                    id: 2,
                    name: "email",
                    type: "email",
                    required: true,
                    placeholder: "Your Email",
                },
                {
                    id: 3,
                    name: "message",
                    type: "textarea",
                    placeholder: "Your Message",
                },
                {
                    id: 4,
                    name: "phone",
                    type: "text",
                    placeholder: "Your Phone Number",
                },
                {
                    id: 5,
                    name: "subject",
                    type: "text",
                    placeholder: "Subject",
                },
                {
                    id: 6,
                    name: "department",
                    type: "select",
                    options: ["Sales", "Support", "General"],
                    placeholder: "Department",
                },
                {
                    id: 7,
                    name: "priority",
                    type: "radio",
                    options: ["High", "Medium", "Low"],
                    placeholder: "Priority",
                },
            ],
        },
    },
    {
        id: 9,
        form_name: "Complex Registration Form",
        form_definition: {
            fields: [
                {
                    id: 1,
                    name: "username",
                    type: "text",
                    required: true,
                    placeholder: "Username",
                },
                {
                    id: 2,
                    name: "password",
                    type: "password",
                    required: true,
                    placeholder: "Password",
                },
                {
                    id: 3,
                    name: "confirmPassword",
                    type: "password",
                    required: true,
                    placeholder: "Confirm Password",
                },
                {
                    id: 4,
                    name: "email",
                    type: "email",
                    placeholder: "Email",
                },
                {
                    id: 5,
                    name: "fullName",
                    type: "text",
                    placeholder: "Full Name",
                },
                {
                    id: 6,
                    name: "birthDate",
                    type: "date",
                    placeholder: "Date of Birth",
                },
                {
                    id: 7,
                    name: "address",
                    type: "textarea",
                    placeholder: "Address",
                },
                {
                    id: 8,
                    name: "phone",
                    type: "text",
                    placeholder: "Phone Number",
                },
                {
                    id: 9,
                    name: "terms",
                    type: "checkbox",
                    required: true,
                    placeholder: "I agree to the terms and conditions",
                },
                // Add more fields here
                {
                    id: 10,
                    name: "occupation",
                    type: "text",
                    placeholder: "Occupation",
                },
                {
                    id: 11,
                    name: "education",
                    type: "select",
                    options: ["High School", "College", "University"],
                    placeholder: "Education Level",
                },
                {
                    id: 12,
                    name: "skills",
                    type: "checkbox",
                    options: ["JavaScript", "Python", "Java", "C++", "HTML", "CSS"],
                    placeholder: "Skills",
                },
                {
                    id: 13,
                    name: "experience",
                    type: "textarea",
                    placeholder: "Work Experience",
                },
                {
                    id: 14,
                    name: "portfolio",
                    type: "text",
                    placeholder: "Portfolio URL",
                },
                {
                    id: 15,
                    name: "interests",
                    type: "checkbox",
                    options: ["Sports", "Music", "Art", "Travel", "Cooking"],
                    placeholder: "Interests",
                },
                {
                    id: 16,
                    name: "socialMedia",
                    type: "text",
                    placeholder: "Social Media Profiles",
                },
                {
                    id: 17,
                    name: "referral",
                    type: "text",
                    placeholder: "Referral Source",
                },
            ],
        },
    },
    {
        id: 10,
        form_name: "Multi-step Form",
        form_definition: {
            fields: [
                {
                    id: 1,
                    name: "firstName",
                    type: "text",
                    required: true,
                    placeholder: "First Name",
                },
                {
                    id: 2,
                    name: "lastName",
                    type: "text",
                    required: true,
                    placeholder: "Last Name",
                },
                {
                    id: 3,
                    name: "email",
                    type: "email",
                    required: true,
                    placeholder: "Email",
                },
                {
                    id: 4,
                    name: "password",
                    type: "password",
                    required: true,
                    placeholder: "Password",
                },
                {
                    id: 5,
                    name: "confirmPassword",
                    type: "password",
                    required: true,
                    placeholder: "Confirm Password",
                },
                {
                    id: 6,
                    name: "address",
                    type: "textarea",
                    placeholder: "Address",
                },
                {
                    id: 7,
                    name: "phone",
                    type: "text",
                    placeholder: "Phone Number",
                },
                {
                    id: 8,
                    name: "dob",
                    type: "date",
                    placeholder: "Date of Birth",
                },
                // Add more fields here
                {
                    id: 9,
                    name: "gender",
                    type: "radio",
                    options: ["Male", "Female", "Other"],
                    placeholder: "Gender",
                },
                {
                    id: 10,
                    name: "occupation",
                    type: "text",
                    placeholder: "Occupation",
                },
                {
                    id: 11,
                    name: "education",
                    type: "select",
                    options: ["High School", "College", "University"],
                    placeholder: "Education Level",
                },
                {
                    id: 12,
                    name: "interests",
                    type: "checkbox",
                    options: ["Sports", "Music", "Art", "Travel", "Cooking"],
                    placeholder: "Interests",
                },
                {
                    id: 13,
                    name: "newsletter",
                    type: "checkbox",
                    placeholder: "Subscribe to newsletter?",
                },
                {
                    id: 14,
                    name: "terms",
                    type: "checkbox",
                    required: true,
                    placeholder: "I agree to the terms and conditions",
                },
                {
                    id: 15,
                    name: "paymentMethod",
                    type: "select",
                    options: ["Credit Card", "PayPal", "Bank Transfer"],
                    placeholder: "Payment Method",
                },
                {
                    id: 16,
                    name: "cardNumber",
                    type: "text",
                    placeholder: "Card Number",
                },
                {
                    id: 17,
                    name: "expiryDate",
                    type: "text",
                    placeholder: "Expiry Date",
                },
                {
                    id: 18,
                    name: "cvv",
                    type: "text",
                    placeholder: "CVV",
                },
            ],
        },
    },
    {
        id: 11,
        form_name: "Product Review Form",
        form_definition: {
            fields: [
                {
                    id: 1,
                    name: "productName",
                    type: "text",
                    required: true,
                    placeholder: "Product Name",
                },
                {
                    id: 2,
                    name: "rating",
                    type: "select",
                    options: ["1", "2", "3", "4", "5"],
                    required: true,
                    placeholder: "Rating",
                },
                {
                    id: 3,
                    name: "review",
                    type: "textarea",
                    required: true,
                    placeholder: "Your Review",
                },
                {
                    id: 4,
                    name: "name",
                    type: "text",
                    required: true,
                    placeholder: "Your Name",
                },
                {
                    id: 5,
                    name: "email",
                    type: "email",
                    required: true,
                    placeholder: "Your Email",
                },
                {
                    id: 6,
                    name: "location",
                    type: "text",
                    placeholder: "Your Location",
                },
                {
                    id: 7,
                    name: "purchaseDate",
                    type: "date",
                    placeholder: "Purchase Date",
                },
                {
                    id: 8,
                    name: "verifiedPurchase",
                    type: "checkbox",
                    placeholder: "Verified Purchase",
                },
                // Add more fields here
                {
                    id: 9,
                    name: "pros",
                    type: "textarea",
                    placeholder: "Pros",
                },
                {
                    id: 10,
                    name: "cons",
                    type: "textarea",
                    placeholder: "Cons",
                },
                {
                    id: 11,
                    name: "recommend",
                    type: "radio",
                    options: ["Yes", "No"],
                    placeholder: "Would you recommend this product?",
                },
                {
                    id: 12,
                    name: "improvements",
                    type: "textarea",
                    placeholder: "Suggestions for Improvement",
                },
                {
                    id: 13,
                    name: "usage",
                    type: "textarea",
                    placeholder: "How do you use this product?",
                },
                {
                    id: 14,
                    name: "photos",
                    type: "text",
                    placeholder: "Product Photos",
                },
                {
                    id: 15,
                    name: "video",
                    type: "text",
                    placeholder: "Product Video",
                },
                {
                    id: 16,
                    name: "socialMedia",
                    type: "text",
                    placeholder: "Social Media Profiles",
                },
                {
                    id: 17,
                    name: "website",
                    type: "text",
                    placeholder: "Website",
                },
            ],
        },
    },
];
