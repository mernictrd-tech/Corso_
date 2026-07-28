import {
    BadgeCheck,
    Zap,
    ShieldCheck
} from "lucide-react";

const HeroFeatures = () => {

    const features = [

        {
            icon: <BadgeCheck size={18} />,
            text: "Recruiter-ready certificates"
        },

        {
            icon: <Zap size={18} />,
            text: "Fast skill validation"
        },

        {
            icon: <ShieldCheck size={18} />,
            text: "Verified online"
        }

    ];

    return (

        <div className="mt-10 flex flex-wrap gap-6">

            {features.map((item) => (

                <div
                    key={item.text}
                    className="flex items-center gap-3"
                >

                    <div className="rounded-full bg-green-500/20 p-2 text-green-400">

                        {item.icon}

                    </div>

                    <p className="text-gray-300">

                        {item.text}

                    </p>

                </div>

            ))}

        </div>

    );

};

export default HeroFeatures;