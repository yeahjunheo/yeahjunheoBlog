import Head from "next/head";

export default function MePage() {
    return (
        <>
            <Head>
                <title>About Me | yeahjunheo</title>
                <meta
                    name="description"
                    content="About yeahjunheo - software engineer and problem solver"
                />
            </Head>

            <div className="min-h-screen bg-background">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <header className="mb-12">
                        <h1 className="text-5xl font-bold text-purple mb-4">
                            What is a Yeahjun HEO?
                        </h1>
                        <div className="h-1 w-32 bg-purple rounded-full"></div>
                    </header>

                    <div className="bg-surface rounded-lg shadow-lg p-8 border-t-4 border-purple">
                        <div className="prose prose-lg max-w-none">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-center">
                                {/* Profile Image */}
                                <div className="flex justify-center lg:justify-end">
                                    <img
                                        src="/me_profile.jpg"
                                        alt="Yeahjun HEO"
                                        className="rounded-full w-80 h-80 object-cover shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-4 border-purple"
                                    />
                                </div>

                                {/* Info Card */}
                                <div>
                                    <div className="bg-background rounded-lg p-6 shadow-md border border-purple/20 w-full">
                                        <h3 className="text-2xl font-bold text-purple mb-4">
                                            Quick Facts
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <span className="text-purple text-xl mt-1">
                                                    📍
                                                </span>
                                                <div>
                                                    <p className="font-semibold text-text-primary text-base mb-0">
                                                        Location
                                                    </p>
                                                    <p className="text-text-secondary text-sm mb-0">
                                                        Kyoto, Japan
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <span className="text-purple text-xl mt-1">
                                                    🎂
                                                </span>
                                                <div>
                                                    <p className="font-semibold text-text-primary text-base mb-0">
                                                        Birthday
                                                    </p>
                                                    <p className="text-text-secondary text-sm mb-0">
                                                        February 11th, 2001
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <span className="text-purple text-xl mt-1">
                                                    🎓
                                                </span>
                                                <div>
                                                    <p className="font-semibold text-text-primary text-base mb-0">
                                                        Education
                                                    </p>
                                                    <p className="text-text-secondary text-sm mb-0">
                                                        Kyoto University
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <span className="text-purple text-xl mt-1">
                                                    💡
                                                </span>
                                                <div>
                                                    <p className="font-semibold text-text-primary text-base mb-0">
                                                        Interests
                                                    </p>
                                                    <p className="text-text-secondary text-sm mb-0">
                                                        Computer networking, the cloud,
                                                        hiking, cooking&eating
                                                        but mostly eating
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xl text-text-primary leading-relaxed mb-8">
                                <strong>Welcome to my corner of the internet!</strong>
                                <br /><br />
                                This space is dedicated to sharing my thoughts, experiences, and endeavors as a person in tech.
                                Somedays I might write about a coding problem I did, other days it might be a personal reflection. 
                                Who knows? But I hope you find something interesting here.
                                <br /><br />
                                Let's get you more acquainted with who I am.
                                <br />
                                Myname's Yeahjun HEO, an aspiring cloud engineer and a problem solver at heart. 
                                I've recently been convinced technical challenges and finding elegant solutions. 
                                When I'm not coding, you can find me exploring the outdoors, hiking new trails, or indulging in my passion for cooking (and eating!).
                                <br /><br />
                                Thanks for stopping by, and I hope you enjoy
                                your stay!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
