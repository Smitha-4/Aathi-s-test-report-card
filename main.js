// --- Essential for Charts: Include Chart.js library in your <head> section ---
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

document.addEventListener('DOMContentLoaded', () => {

    // --- Set Chart.js Global Defaults for Dark Theme ---
    const rootStyles = getComputedStyle(document.documentElement);

    Chart.defaults.color = rootStyles.getPropertyValue('--light-text-primary'); // Default text color for all chart labels, tooltips etc.
    Chart.defaults.borderColor = rootStyles.getPropertyValue('--dark-border-primary'); // Default border color for lines, axes.
    // We are deliberately NOT setting Chart.defaults.backgroundColor here to transparent,
    // as we'll use a plugin to draw a specific background color for the chartArea.

    // --- Chart.js Plugin for Chart Area Background ---
    // This plugin draws a solid background color behind the chart data.
    const chartAreaBackground = {
        id: 'chartAreaBackground',
        beforeDraw(chart, args, options) {
            const { ctx, chartArea: { left, top, width, height } } = chart;
            ctx.save();
            ctx.fillStyle = options.backgroundColor || 'transparent'; // Use the color from plugin options
            ctx.fillRect(left, top, width, height);
            ctx.restore();
        }
    };

    // Register the plugin
    Chart.register(chartAreaBackground);

    // --- General Circular Progress Bar Animation (for main summary circles) ---
    function animateCircularProgress(element) {
        const percentage = parseInt(element.dataset.percentage);
        const color = element.dataset.color; // Get color from data-color attribute
        const progressValueSpan = element.querySelector('.progress-value') || element.querySelector('.small-progress-value');
        const isFraction = progressValueSpan.textContent.includes('/');
        const isNumberOnly = !isNaN(parseInt(progressValueSpan.textContent)) && !progressValueSpan.textContent.includes('%');

        let progressStartValue = 0;
        let speed = 20;

        let progress = setInterval(() => {
            progressStartValue++;
            if (progressStartValue <= percentage) {
                if (!isFraction && !isNumberOnly) {
                     progressValueSpan.textContent = `${progressStartValue}%`;
                }
                element.style.background = `conic-gradient(
                    ${color} ${progressStartValue * 3.6}deg,
                    var(--dark-border-primary) ${progressStartValue * 3.6}deg
                )`;
            } else {
                clearInterval(progress);
            }
        }, speed);
    }
    document.querySelectorAll('.circular-progress, .small-circular-progress').forEach(animateCircularProgress);

    // --- Linear Skill Slider Animation (for individual skills) ---
    const skillFills = document.querySelectorAll('.skill-fill');
    skillFills.forEach(fill => {
        const skillLevel = parseInt(fill.dataset.skillLevel);
        fill.style.setProperty('--skill-level', `${skillLevel}%`);
    });


    // --- Chart.js Integration for Performance Chart ---
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        const performanceData = [
            { topic: "Artist Lab", performance: 70 },
            { topic: "Sprite Lab Costume", performance: 70 },
            { topic: "Sprite Lab Game", performance: 70 },
            { topic: "Collect Honey Lvl 1", performance: 85 },
            { topic: "Collect Honey Lvl 2", performance: 85 },
            { topic: "Explained Loops", performance: 95 },
            { topic: "App Lab Variables (1)", performance: 95 },
            { topic: "App Lab Variables (2)", performance: 95 },
            { topic: "Variables Writing", performance: 95 },
            { topic: "App Lab + Flappy Bird", performance: 95 },
            { topic: "Play Lab: Defeat Dragon", performance: 95 },
            { topic: "Defeat Alien Game", performance: 95 },
            { topic: "For Loop & Conditionals", performance: 95 },
            { topic: "Bubble Shooter Game", performance: 95 },
            { topic: "Revision Exercise", performance: 95 },
            { topic: "Test", performance: 95 },
            { topic: "Intro to Game Lab", performance: 95 },
            { topic: "Bounce Ball Lvl 1", performance: 95 },
            { topic: "Bounce Ball Lvl 2", performance: 95 },
        ];

        new Chart(performanceCtx, {
            type: 'bar',
            data: {
                labels: performanceData.map(d => d.topic),
                datasets: [{
                    label: 'Performance Score (Max 100)',
                    data: performanceData.map(d => d.performance),
                    backgroundColor: (context) => {
                        const value = context.raw;
                        if (value >= 90) return rootStyles.getPropertyValue('--accent-green');
                        if (value >= 80) return rootStyles.getPropertyValue('--accent-blue');
                        if (value >= 70) return rootStyles.getPropertyValue('--accent-yellow');
                        return rootStyles.getPropertyValue('--accent-red');
                    },
                    borderColor: (context) => {
                        const value = context.raw;
                        if (value >= 90) return rootStyles.getPropertyValue('--accent-green');
                        if (value >= 80) return rootStyles.getPropertyValue('--accent-blue');
                        if (value >= 70) return rootStyles.getPropertyValue('--accent-yellow');
                        return rootStyles.getPropertyValue('--accent-red');
                    },
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Performance (%)',
                            color: rootStyles.getPropertyValue('--light-text-secondary'),
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            color: rootStyles.getPropertyValue('--light-text-primary'),
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            color: 'rgba(98, 114, 164, 0.3)', // Softer grid lines
                            borderColor: rootStyles.getPropertyValue('--dark-border-secondary') // Axis line color
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Topic',
                            color: rootStyles.getPropertyValue('--light-text-secondary'),
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            color: rootStyles.getPropertyValue('--light-text-primary'), // BRIGHT COLOR FOR TOPIC LABELS
                            font: {
                                size: 16
                            },
                            autoSkip: false,
                        },
                        grid: {
                            color: 'rgba(98, 114, 164, 0.3)', // Softer grid lines
                            borderColor: rootStyles.getPropertyValue('--dark-border-secondary') // Axis line color
                        }
                    }
                },
                plugins: {
                    chartAreaBackground: { // *** NEW PLUGIN OPTION FOR BACKGROUND ***
                        backgroundColor: rootStyles.getPropertyValue('--dark-bg-card') // Background color for the chart plotting area
                    },
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Performance per Class Topic',
                        color: rootStyles.getPropertyValue('--light-text-accent'),
                        font: {
                            size: 20,
                            weight: 'bold'
                        }
                    }
                }
            }
        });
    }

    // --- Chart.js Integration for Homework Chart ---
    const homeworkCtx = document.getElementById('homeworkChart');
    if (homeworkCtx) {
        const homeworkChartData = {
            assigned: 3,
            completed: 2
        };

        new Chart(homeworkCtx, {
            type: 'doughnut',
            data: {
                labels: ['Homeworks Completed/Submitted', 'Homeworks Not Completed'],
                datasets: [{
                    data: [homeworkChartData.completed, homeworkChartData.assigned - homeworkChartData.completed],
                    backgroundColor: [
                        rootStyles.getPropertyValue('--accent-green'), // Green for completed
                        rootStyles.getPropertyValue('--accent-red')  // Red for not completed
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    chartAreaBackground: { // *** NEW PLUGIN OPTION FOR BACKGROUND ***
                        backgroundColor: rootStyles.getPropertyValue('--dark-bg-card') // Background color for the chart plotting area
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            color: rootStyles.getPropertyValue('--light-text-primary'),
                            font: {
                                size: 14
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Homework Completion Rate',
                        color: rootStyles.getPropertyValue('--light-text-accent'),
                        font: {
                            size: 18,
                            weight: 'bold'
                        }
                    }
                }
            }
        });
    }
});