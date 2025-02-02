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

function processPermissions(jsonData) {
    const permissions = {
        permissions: {}
    };

    // Sort groups by weight
    const groups = Object.entries(jsonData.groups || {})
        .sort((a, b) => getGroupWeight(b[1]) - getGroupWeight(a[1]));

    // Track processed permissions
    const processedPerms = new Set();
    const numericPerms = new Set();

    // First pass: collect numeric permissions
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

    // Add numeric permissions
    if (numericPerms.size > 0) {
        permissions.permissions['# Numeric Permissions'] = {};
        Array.from(numericPerms).sort().forEach(perm => {
            permissions.permissions['# Numeric Permissions'][perm] = '';
        });
    }

    // Process each group
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

function convertToYaml() {
    const inputElement = document.getElementById('inputJson');
    const outputElement = document.getElementById('outputYaml');
    const errorElement = document.getElementById('errorMessage');

    try {
        // Parse JSON
        const jsonData = JSON.parse(inputElement.value);

        // Process permissions
        const processed = processPermissions(jsonData);

        // Convert to YAML
        let yamlOutput = 'permissions:\n';

        Object.entries(processed.permissions).forEach(([section, perms]) => {
            yamlOutput += `  ${section}\n`;
            Object.entries(perms).forEach(([perm, value]) => {
                yamlOutput += `  "${perm}": ""\n`;
            });
            yamlOutput += '\n';
        });

        outputElement.value = yamlOutput;
        errorElement.style.display = 'none';
    } catch (error) {
        errorElement.textContent = `Error: ${error.message}`;
        errorElement.style.display = 'block';
        outputElement.value = '';
    }
}

function copyToClipboard() {
    const outputElement = document.getElementById('outputYaml');
    outputElement.select();
    document.execCommand('copy');
}

function loadSampleJson() {
    const sampleJson = {
        "groups": {
            "admin": {
                "nodes": [
                    {
                        "type": "permission",
                        "key": "grim.alerts.enable-on-join"
                    },
                    {
                        "type": "weight",
                        "key": "weight.100"
                    }
                ]
            }
            // Add more sample groups as needed
        }
    };

    document.getElementById('inputJson').value = JSON.stringify(sampleJson, null, 2);
}
