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
                    Bachelor of Science, Computer Science / Mathematics
                </h3>
                <p className="text-sm text-gray-500">
                    Institut National Des Sciences Appliquées De Toulouse - Toulouse,
                    France
                </p>
                <p className="text-sm mt-2">
                    Scholarship for 10 months in an exchange program to study theoretical
                    mathematics.
                    <br/>
                    I had the chance to study at one of the top 5 Computer Science /
                    Mathematics programs for a full year.
                    <br/>
                    I learned how to prepare for and approach the real problems of
                    engineering and experienced ADA programming.
                    <br/>
                    Also had the chance to meet new people and new cultures, one of which
                    still is a good friend of mine and lives 20 minutes away in Zurich.
                </p>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold">
                    Bachelor’s in Computer Science, Information Technology
                </h3>
                <p className="text-sm text-gray-500">
                    Universitatea „Petru Maior” Din Târgu-Mureș
                </p>
            </div>
        </div>
    );
};

export default EducationCard;
