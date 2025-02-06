const EducationCard = () => {
    return (
        <div className="shadow-md p-3 m-3 card">
            <h2 className="text-xl font-semibold">EDUCATION AND TRAINING</h2>
            <div className="mt-2">
                <h3 className="text-lg font-semibold">High School Diploma</h3>
                <p className="text-sm text-gray-500">
                    Colegiul National "Unirea" Targu Mures - Targu Mures, Romania
                </p>
            </div>
            <div className="mt-2">
                <h3 className="text-lg font-semibold">
                    Bachelor of Science in Computer Science & Mathematics
                </h3>
                <p className="text-sm text-gray-500">
                    Institut National des Sciences Appliquées de Toulouse - Toulouse, France
                </p>
                <p className="text-sm mt-2">
                    Awarded a scholarship for a 10-month exchange program to study theoretical mathematics.
                    <br/>
                    Attended one of the top 5 Computer Science & Mathematics programs for an entire academic year.
                    <br/>
                    Developed practical skills in tackling real-world engineering challenges and gained experience in
                    ADA programming.
                    <br/>
                    Enjoyed a culturally enriching experience that fostered lifelong friendships, including one with a
                    friend who now lives just 20 minutes away in Zurich.
                </p>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold">
                    Bachelor’s in Computer Science & Information Technology
                </h3>
                <p className="text-sm text-gray-500">
                    Universitatea „Petru Maior” din Târgu-Mureș
                </p>
            </div>
        </div>
    );
};

export default EducationCard;
