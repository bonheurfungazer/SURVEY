const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const oldLogic = `      if (recentData && recentData.length > 0) {
        // Calculate chart line points
        // Get votes from the last 24h, group by hour for the chart
        const chartVotes = recentData.slice().reverse() // chronological order

        // Simple logic to distribute points across the X axis (0 to 300)
        // Y axis goes from 90 (bottom) to 10 (top)

        let realVotesCount = 0;
        let genVotesCount = 0;

        // Let's create an array of points for the paths
        const realPoints: {x: number, y: number}[] = [{x: 0, y: 90}]
        const genPoints: {x: number, y: number}[] = [{x: 0, y: 90}, {x: 300, y: 90}]

        const totalVotesChart = chartVotes.length;
        const width = 300;

        chartVotes.forEach((v, idx) => {
            const x = Math.round((idx + 1) * (width / totalVotesChart));
            if (v.is_real_user) {
                realVotesCount++;
            }
            const realY = 90 - (Math.min(realVotesCount / totalVotesChart, 1) * 80);
            realPoints.push({x, y: realY});
        });

        // Function to convert points to an SVG path curve
        const generatePath = (points: {x: number, y: number}[]) => {
            if (points.length === 0) return "M0,90";
            if (points.length === 1) return \`M\${points[0].x},\${points[0].y}\`;
            if (points.length === 2) return \`M\${points[0].x},\${points[0].y} L\${points[1].x},\${points[1].y}\`;

            let path = \`M\${points[0].x},\${points[0].y}\`;
            for (let i = 1; i < points.length - 1; i++) {
                const xc = (points[i].x + points[i + 1].x) / 2;
                const yc = (points[i].y + points[i + 1].y) / 2;
                path += \` Q\${points[i].x},\${points[i].y} \${xc},\${yc}\`;
            }
            // Curve to the last point
            path += \` T\${points[points.length - 1].x},\${points[points.length - 1].y}\`;
            return path;
        };

        const realLineStr = generatePath(realPoints);
        const genLineStr = "M0,90 L300,90";`;

const newLogic = `      if (recentData && recentData.length > 0) {
        // We will fetch 24h data grouped by hour to match the server-side logic
        const { data: chartData } = await supabase
            .from('votes')
            .select('created_at')
            .eq('is_real_user', true)
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

        let realLineStr = "M0,90 L300,90";
        if (chartData && chartData.length > 0) {
            const hourlyCounts = new Array(24).fill(0);
            chartData.forEach(vote => {
                const hour = new Date(vote.created_at).getHours();
                hourlyCounts[hour]++;
            });

            const maxVotesPerHour = Math.max(...hourlyCounts, 1);

            const realPoints = hourlyCounts.map((count, index) => {
                const x = (index / 23) * 300; // 24 points (0 to 23), mapped to 0-300 width
                const y = 90 - (count / maxVotesPerHour) * 80; // Map 0-max to 90-10 height
                return { x, y };
            });

            const generatePath = (points: {x: number, y: number}[]) => {
                if (points.length === 0) return "M0,90";
                if (points.length === 1) return \`M\${points[0].x},\${points[0].y}\`;
                if (points.length === 2) return \`M\${points[0].x},\${points[0].y} L\${points[1].x},\${points[1].y}\`;

                let path = \`M\${points[0].x},\${points[0].y}\`;
                for (let i = 0; i < points.length - 1; i++) {
                    const xc = (points[i].x + points[i + 1].x) / 2;
                    const yc = (points[i].y + points[i + 1].y) / 2;
                    // Use bezier curves for smoother graph
                    if (i === 0) {
                        path += \` Q\${points[i].x},\${points[i].y} \${xc},\${yc}\`;
                    } else {
                        path += \` T\${xc},\${yc}\`;
                    }
                }
                path += \` T\${points[points.length - 1].x},\${points[points.length - 1].y}\`;
                return path;
            };

            realLineStr = generatePath(realPoints);
        }

        const genLineStr = "M0,90 L300,90";`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync('src/app/page.tsx', content);
