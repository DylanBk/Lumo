'use client';

import { useTheme } from '@/context/ThemeContext';
import { useContrast } from '@/context/ContrastContext';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';


const Preferences = () => {
    const {theme, toggleTheme} = useTheme();
    const {contrast, toggleContrast} = useContrast();
    const isLight = theme === 'light';

    return (
        <section>
            <h2>Preferences</h2>

            <div className="flex flex-col mt-8">
                <h5>Display & Accessibility</h5>

                <div className="flex flex-col gap-8 mt-4">
                    <div className="flex flex-col gap-2">
                        <h6>Theme</h6>

                        <button
                            className={`toggle-container ${isLight ? "justify-start" : "justify-end "}`}
                            onClick={toggleTheme}
                            aria-label={`Switch to ${isLight ? "Dark" : "Light"} Mode`}
                            aria-pressed={!isLight}
                            tabIndex={0}>
                            <motion.div
                                className='toggler'
                                layout
                                transition={{
                                    type: 'spring',
                                    stiffness: 700,
                                    damping: 30
                                }}
                            >
                                {isLight ?
                                    <Sun className="h-4 w-4" />
                                :
                                    <Moon className="h-4 w-4" />
                                }
                            </motion.div>
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h6>High Contrast</h6>

                        <button
                            className={`toggle-container ${!contrast ? "justify-start" : "justify-end"}`}
                            onClick={toggleContrast}
                            aria-label={`High Contrast ${contrast ? "On" : "Off"}`}
                            aria-pressed={contrast}
                            tabIndex={0}>
                            <motion.div
                                className='toggler'
                                layout
                                transition={{
                                    type: 'spring',
                                    stiffness: 700,
                                    damping: 30
                                }}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Preferences;