import type { DetectedStack } from './reviewTypes';

function detectStackFromCode(code: string): DetectedStack {
    const lower = code.toLowerCase();

    if (
        code.includes('extends StatelessWidget') ||
        code.includes('extends StatefulWidget') ||
        lower.includes('widget build(') ||
        lower.includes('scaffold(') ||
        lower.includes('materialapp')
    ) {
        return 'flutter';
    }

    if (
        lower.includes('import react') ||
        lower.includes('from "react"') ||
        lower.includes("from 'react'") ||
        lower.includes('usestate(') ||
        lower.includes('useeffect(') ||
        /<\w+[^>]*>[\s\S]*<\/\w+>/.test(code)
    ) {
        return 'react';
    }

    return 'other';
}

export { detectStackFromCode };
export default detectStackFromCode;
