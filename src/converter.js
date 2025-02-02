function normalizePermission(perm) {
    return perm.replace(/\.\d+/g, '.#');
}

function getGroupWeight(groupData) {
    if (!groupData.nodes) return 0;

    for (const node of groupData.nodes) {
        if (node.type === 'weight') {
            const weightMatch = node.key.match(/weight\.(\d+)/);
            if (weightMatch) {
                return parseInt(weightMatch[1]);
            }
        }
    }
    return 0;
}

export function processPermissions(jsonData) {
    const permissions = {
        permissions: {}
    };

    const groups = Object.entries(jsonData.groups || {})
        .sort((a, b) => getGroupWeight(b[1]) - getGroupWeight(a[1]));

    const processedPerms = new Set();
    const numericPerms = new Set();

    groups.forEach(([_, groupData]) => {
        if (groupData.nodes) {
            groupData.nodes.forEach(node => {
                if (node.type === 'permission') {
                    const normPerm = normalizePermission(node.key);
                    if (normPerm.includes('#') || /\.\d+/.test(node.key)) {
                        numericPerms.add(normPerm);
                    }
                }
            });
        }
    });

    if (numericPerms.size > 0) {
        permissions.permissions['# Numeric Permissions'] = {};
        Array.from(numericPerms).sort().forEach(perm => {
            permissions.permissions['# Numeric Permissions'][perm] = '';
        });
    }

    groups.forEach(([groupName, groupData]) => {
        const categoryName = `# ${groupName.replace('_', ' ').charAt(0).toUpperCase() + groupName.slice(1)} Permissions`;
        const currentGroupPerms = {};

        if (groupData.nodes) {
            groupData.nodes.forEach(node => {
                if (node.type === 'permission') {
                    const normPerm = normalizePermission(node.key);
                    if (!processedPerms.has(normPerm) && !numericPerms.has(normPerm)) {
                        currentGroupPerms[normPerm] = '';
                        processedPerms.add(normPerm);
                    }
                }
            });
        }

        if (Object.keys(currentGroupPerms).length > 0) {
            permissions.permissions[categoryName] = Object.fromEntries(
                Object.entries(currentGroupPerms).sort()
            );
        }
    });

    return permissions;
} 