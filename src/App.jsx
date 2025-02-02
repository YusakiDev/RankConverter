import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import yaml from 'js-yaml';

function App() {
  const [inputJson, setInputJson] = useState('');
  const [outputYaml, setOutputYaml] = useState('');

  const convertToYaml = () => {
    try {
      const jsonData = JSON.parse(inputJson);
      const yamlOutput = yaml.dump(jsonData, {
        indent: 2,
        lineWidth: -1,
      });
      setOutputYaml(yamlOutput);
      toast.success('Conversion successful!');
    } catch (error) {
      toast.error('Invalid JSON input!');
    }
  };

  const loadSampleJson = () => {
    const sampleJson = {
      permissions: {
        read: true,
        write: false,
        execute: true,
      },
      users: ['admin', 'user1', 'user2'],
    };
    setInputJson(JSON.stringify(sampleJson, null, 2));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputYaml);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Permission JSON to YAML Converter
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Input JSON</h3>
            <textarea
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              className="w-full h-96 p-4 border rounded-lg font-mono bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Paste your JSON here..."
            />
            <div className="space-x-4">
              <button
                onClick={convertToYaml}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Convert
              </button>
              <button
                onClick={loadSampleJson}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Load Sample
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Output YAML</h3>
            <textarea
              value={outputYaml}
              readOnly
              className="w-full h-96 p-4 border rounded-lg font-mono bg-gray-50 shadow-sm"
            />
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App; 