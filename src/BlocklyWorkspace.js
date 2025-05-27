import React, { useEffect, useRef, useCallback } from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks';

// Custom Dart blocks with proper connection types
const dartBlocks = {
  // Class definition block
  'dart_class': {
    init: function() {
      this.appendDummyInput()
          .appendField("class")
          .appendField(new Blockly.FieldTextInput("MyClass"), "CLASS_NAME");
      this.appendStatementInput("BODY")
          .setCheck(null)
          .appendField("body");
      this.setColour(230);
      this.setTooltip("Dart class definition");
      this.setHelpUrl("");
      this.setDeletable(true);
      this.setMovable(true);
      this.setEditable(true);
    }
  },

  // Method definition block
  'dart_method': {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            ["void", "void"],
            ["String", "String"],
            ["int", "int"],
            ["bool", "bool"],
            ["double", "double"]
          ]), "RETURN_TYPE")
          .appendField(new Blockly.FieldTextInput("methodName"), "METHOD_NAME")
          .appendField("(")
          .appendField(new Blockly.FieldTextInput(""), "PARAMETERS")
          .appendField(")");
      this.appendStatementInput("BODY")
          .setCheck(null)
          .appendField("body");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("Dart method definition");
      this.setDeletable(true);
      this.setMovable(true);
      this.setEditable(true);
    }
  },

  // Variable declaration block
  'dart_variable': {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            ["var", "var"],
            ["final", "final"],
            ["const", "const"],
            ["String", "String"],
            ["int", "int"],
            ["bool", "bool"],
            ["List", "List"],
            ["Map", "Map"]
          ]), "VAR_TYPE")
          .appendField(new Blockly.FieldTextInput("variableName"), "VAR_NAME")
          .appendField("=");
      this.appendValueInput("VALUE")
          .setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(290);
      this.setTooltip("Dart variable declaration");
      this.setDeletable(true);
      this.setMovable(true);
      this.setEditable(true);
    }
  },

  // If statement block
  'dart_if': {
    init: function() {
      this.appendValueInput("CONDITION")
          .setCheck("Boolean")
          .appendField("if");
      this.appendStatementInput("THEN_BODY")
          .setCheck(null)
          .appendField("then");
      this.appendStatementInput("ELSE_BODY")
          .setCheck(null)
          .appendField("else");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip("Dart if statement");
      this.setDeletable(true);
      this.setMovable(true);
      this.setEditable(true);
    }
  },

  // For loop block
  'dart_for': {
    init: function() {
      this.appendDummyInput()
          .appendField("for")
          .appendField("(")
          .appendField(new Blockly.FieldTextInput("item"), "ITERATOR")
          .appendField("in")
          .appendField(new Blockly.FieldTextInput("list"), "ITERABLE")
          .appendField(")");
      this.appendStatementInput("BODY")
          .setCheck(null)
          .appendField("body");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Dart for loop");
      this.setDeletable(true);
      this.setMovable(true);
      this.setEditable(true);
    }
  },

  // Return statement block
  'dart_return': {
    init: function() {
      this.appendValueInput("VALUE")
          .setCheck(null)
          .appendField("return");
      this.setPreviousStatement(true, null);
      this.setColour(330);
      this.setTooltip("Dart return statement");
      this.setDeletable(true);
      this.setMovable(true);
      this.setEditable(true);
    }
  },

  // String literal block
  'dart_string': {
    init: function() {
      this.appendDummyInput()
          .appendField("\"")
          .appendField(new Blockly.FieldTextInput("text"), "TEXT")
          .appendField("\"");
      this.setOutput(true, "String");
      this.setColour(160);
      this.setTooltip("String literal");
      this.setDeletable(true);
      this.setMovable(true);
      this.setEditable(true);
    }
  },

  // Number literal block
  'dart_number': {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldNumber(0), "NUMBER");
      this.setOutput(true, "Number");
      this.setColour(230);
      this.setTooltip("Number literal");
      this.setDeletable(true);
      this.setMovable(true);
      this.setEditable(true);
    }
  },

  // Boolean literal block
  'dart_boolean': {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            ["true", "true"],
            ["false", "false"]
          ]), "BOOL");
      this.setOutput(true, "Boolean");
      this.setColour(210);
      this.setTooltip("Boolean literal");
      this.setDeletable(true);
      this.setMovable(true);
      this.setEditable(true);
    }
  },

  // Constructor block
  'dart_constructor': {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldTextInput("ClassName"), "CLASS_NAME")
          .appendField("(")
          .appendField(new Blockly.FieldTextInput("parameters"), "PARAMETERS")
          .appendField(")");
      this.appendStatementInput("BODY")
          .setCheck(null)
          .appendField("body");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(290);
      this.setTooltip("Dart constructor");
      this.setDeletable(true);
      this.setMovable(true);
      this.setEditable(true);
    }
  },

  // List declaration block
  'dart_list': {
    init: function() {
      this.appendDummyInput()
          .appendField("List<")
          .appendField(new Blockly.FieldTextInput("String"), "TYPE")
          .appendField(">");
      this.appendValueInput("ELEMENTS")
          .setCheck(null)
          .appendField("=");
      this.setOutput(true, "List");
      this.setColour(160);
      this.setTooltip("Dart List declaration");
      this.setDeletable(true);
      this.setMovable(true);
      this.setEditable(true);
    }
  }
};

// Register all custom blocks
Object.keys(dartBlocks).forEach(blockName => {
  Blockly.Blocks[blockName] = dartBlocks[blockName];
});

// Define the toolbox with Dart-specific categories
const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: '🏗️ Structure',
      colour: 230,
      contents: [
        { kind: 'block', type: 'dart_class' },
        { kind: 'block', type: 'dart_method' },
        { kind: 'block', type: 'dart_constructor' }
      ]
    },
    {
      kind: 'category',
      name: '📦 Variables',
      colour: 290,
      contents: [
        { kind: 'block', type: 'dart_variable' },
        { kind: 'block', type: 'dart_list' }
      ]
    },
    {
      kind: 'category',
      name: '🔀 Control Flow',
      colour: 210,
      contents: [
        { kind: 'block', type: 'dart_if' },
        { kind: 'block', type: 'dart_for' },
        { kind: 'block', type: 'dart_return' }
      ]
    },
    {
      kind: 'category',
      name: '📊 Values',
      colour: 160,
      contents: [
        { kind: 'block', type: 'dart_string' },
        { kind: 'block', type: 'dart_number' },
        { kind: 'block', type: 'dart_boolean' }
      ]
    }
  ]
};

const BlocklyWorkspace = ({ dartCode, onBlocksChange }) => {
  const blocklyDiv = useRef();
  const workspace = useRef();
  const isInitialized = useRef(false);
  const lastProcessedCode = useRef('');

  // Memoized resize function to prevent unnecessary re-renders
  const handleResize = useCallback(() => {
    if (workspace.current && blocklyDiv.current) {
      Blockly.svgResize(workspace.current);
    }
  }, []);

  // Initialize workspace only once
  useEffect(() => {
    if (blocklyDiv.current && !isInitialized.current) {
      try {
        // Initialize Blockly workspace with proper configuration
        workspace.current = Blockly.inject(blocklyDiv.current, {
          toolbox: toolbox,
          theme: Blockly.Themes.Modern,
          grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true
          },
          zoom: {
            controls: true,
            wheel: true,
            startScale: 0.9,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
          },
          trashcan: true,
          scrollbars: true,
          horizontalLayout: false,
          toolboxPosition: 'start',
          renderer: 'geras',
          move: {
            scrollbars: {
              horizontal: true,
              vertical: true
            },
            drag: true,
            wheel: true
          },
          sounds: false,
          oneBasedIndex: true
        });

        // Add change listener with debouncing
        let changeTimeout;
        workspace.current.addChangeListener(() => {
          if (changeTimeout) clearTimeout(changeTimeout);
          changeTimeout = setTimeout(() => {
            if (onBlocksChange && workspace.current) {
              try {
                const xml = Blockly.Xml.workspaceToDom(workspace.current);
                const xmlText = Blockly.Xml.domToText(xml);
                onBlocksChange(xmlText);
              } catch (error) {
                console.error('Error generating XML:', error);
              }
            }
          }, 300);
        });

        // Add resize listener
        window.addEventListener('resize', handleResize);
        
        isInitialized.current = true;
        
        // Initial resize
        setTimeout(handleResize, 100);

      } catch (error) {
        console.error('Error initializing Blockly:', error);
      }
    }

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (workspace.current && isInitialized.current) {
        try {
          workspace.current.dispose();
        } catch (error) {
          console.error('Error disposing workspace:', error);
        }
        workspace.current = null;
        isInitialized.current = false;
      }
    };
  }, []); // Empty dependency array - only run once

  // Handle dartCode changes separately
  useEffect(() => {
    if (dartCode && workspace.current && isInitialized.current && dartCode !== lastProcessedCode.current) {
      try {
        convertDartCodeToBlocks(dartCode);
        lastProcessedCode.current = dartCode;
      } catch (error) {
        console.error('Error converting Dart code to blocks:', error);
      }
    }
  }, [dartCode]);

  const convertDartCodeToBlocks = async (code) => {
    if (!workspace.current) return;

    try {
      // Clear existing blocks
      workspace.current.clear();

      // Parse the Dart code and convert to blocks
      const parsedStructure = parseDartCodeToStructure(code);
      
      if (!parsedStructure || parsedStructure.length === 0) {
        console.log('No valid structure found to convert to blocks');
        return;
      }

      // Create connected block structure
      await createConnectedBlocks(parsedStructure);

      // Final render and arrange
      setTimeout(() => {
        if (workspace.current) {
          // Auto-arrange blocks nicely
          workspace.current.cleanUp();
          // Center the view
          workspace.current.scrollCenter();
        }
      }, 500);

    } catch (error) {
      console.error('Error converting Dart code to blocks:', error);
    }
  };

  const parseDartCodeToStructure = (code) => {
    const structure = [];
    const lines = code.split('\n').map(line => line.trim()).filter(line => line);
    
    let currentClass = null;
    let braceDepth = 0;
    let inClass = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Track brace depth
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      braceDepth += openBraces - closeBraces;
      
      // Class detection
      if (line.startsWith('class ')) {
        const classMatch = line.match(/class\s+(\w+)/);
        if (classMatch) {
          currentClass = {
            type: 'class',
            name: classMatch[1],
            methods: [],
            variables: []
          };
          inClass = true;
          structure.push(currentClass);
          continue;
        }
      }
      
      // Method detection (inside class)
      if (inClass && currentClass && (
          line.includes('void ') || 
          line.includes('String ') || 
          line.includes('int ') || 
          line.includes('bool ') ||
          line.includes('double ')
        ) && line.includes('(') && line.includes(')')) {
        
        const methodMatch = line.match(/(void|String|int|bool|double)\s+(\w+)\s*\(([^)]*)\)/);
        if (methodMatch) {
          currentClass.methods.push({
            type: 'method',
            returnType: methodMatch[1],
            name: methodMatch[2],
            parameters: methodMatch[3].trim()
          });
          continue;
        }
      }
      
      // Variable detection (inside class)
      if (inClass && currentClass && (
          line.includes('var ') || 
          line.includes('final ') || 
          line.includes('const ') ||
          line.includes('String ') ||
          line.includes('int ') ||
          line.includes('List ')
        ) && line.includes('=')) {
        
        const varMatch = line.match(/(var|final|const|String|int|bool|List)\s+(\w+)\s*=\s*(.+);?/);
        if (varMatch) {
          currentClass.variables.push({
            type: 'variable',
            varType: varMatch[1],
            name: varMatch[2],
            value: varMatch[3]
          });
          continue;
        }
      }
      
      // End of class
      if (inClass && braceDepth === 0 && line === '}') {
        inClass = false;
        currentClass = null;
      }
    }
    
    return structure;
  };

  const createConnectedBlocks = async (structure) => {
    if (!workspace.current || !structure.length) return;

    let yOffset = 50;
    
    for (const item of structure) {
      if (item.type === 'class') {
        // Create class block
        const classBlock = createBlock('dart_class', 50, yOffset);
        if (classBlock) {
          // Set class name
          const classNameField = classBlock.getField('CLASS_NAME');
          if (classNameField) {
            classNameField.setValue(item.name);
          }
          
          // Create method blocks and connect them to class body
          let bodyConnection = classBlock.getInput('BODY')?.connection;
          let previousMethodBlock = null;
          
          // Add variables first
          for (const variable of item.variables) {
            const varBlock = createBlock('dart_variable', 100, yOffset + 100);
            if (varBlock) {
              // Set variable properties
              const varTypeField = varBlock.getField('VAR_TYPE');
              const varNameField = varBlock.getField('VAR_NAME');
              
              if (varTypeField) varTypeField.setValue(variable.varType);
              if (varNameField) varNameField.setValue(variable.name);
              
              // Create value block if needed
              if (variable.value) {
                const valueBlock = createValueBlock(variable.value, 300, yOffset + 100);
                if (valueBlock) {
                  const valueInput = varBlock.getInput('VALUE');
                  if (valueInput?.connection && valueBlock.outputConnection) {
                    await connectBlocks(valueInput.connection, valueBlock.outputConnection);
                  }
                }
              }
              
              // Connect to class body or previous block
              if (bodyConnection && varBlock.previousConnection) {
                await connectBlocks(bodyConnection, varBlock.previousConnection);
                bodyConnection = varBlock.nextConnection;
              } else if (previousMethodBlock?.nextConnection && varBlock.previousConnection) {
                await connectBlocks(previousMethodBlock.nextConnection, varBlock.previousConnection);
              }
              
              previousMethodBlock = varBlock;
              yOffset += 80;
            }
          }
          
          // Add methods
          for (const method of item.methods) {
            const methodBlock = createBlock('dart_method', 100, yOffset + 100);
            if (methodBlock) {
              // Set method properties
              const returnTypeField = methodBlock.getField('RETURN_TYPE');
              const methodNameField = methodBlock.getField('METHOD_NAME');
              const parametersField = methodBlock.getField('PARAMETERS');
              
              if (returnTypeField) returnTypeField.setValue(method.returnType);
              if (methodNameField) methodNameField.setValue(method.name);
              if (parametersField && method.parameters) {
                parametersField.setValue(method.parameters);
              }
              
              // Connect to class body or previous block
              if (bodyConnection && methodBlock.previousConnection) {
                await connectBlocks(bodyConnection, methodBlock.previousConnection);
                bodyConnection = methodBlock.nextConnection;
              } else if (previousMethodBlock?.nextConnection && methodBlock.previousConnection) {
                await connectBlocks(previousMethodBlock.nextConnection, methodBlock.previousConnection);
              }
              
              previousMethodBlock = methodBlock;
              yOffset += 120;
            }
          }
        }
        
        yOffset += 200; // Space between classes
      }
    }
    
    // Final render
    if (workspace.current) {
      workspace.current.render();
    }
  };

  const createBlock = (type, x, y) => {
    if (!workspace.current) return null;
    
    try {
      const block = workspace.current.newBlock(type);
      block.initSvg();
      block.moveBy(x, y);
      block.render();
      return block;
    } catch (error) {
      console.error('Error creating block:', error);
      return null;
    }
  };

  const createValueBlock = (value, x, y) => {
    if (!workspace.current) return null;
    
    try {
      let blockType = 'dart_string';
      let fieldValue = value;
      
      // Determine block type based on value
      if (/^\d+$/.test(value.trim())) {
        blockType = 'dart_number';
        fieldValue = parseInt(value.trim());
      } else if (value.trim() === 'true' || value.trim() === 'false') {
        blockType = 'dart_boolean';
        fieldValue = value.trim();
      } else if (value.includes('"') || value.includes("'")) {
        blockType = 'dart_string';
        fieldValue = value.replace(/['"]/g, '');
      } else if (value.includes('[')) {
        blockType = 'dart_list';
      }
      
      const block = createBlock(blockType, x, y);
      if (block) {
        // Set field value
        if (blockType === 'dart_string') {
          const textField = block.getField('TEXT');
          if (textField) textField.setValue(fieldValue);
        } else if (blockType === 'dart_number') {
          const numberField = block.getField('NUMBER');
          if (numberField) numberField.setValue(fieldValue);
        } else if (blockType === 'dart_boolean') {
          const boolField = block.getField('BOOL');
          if (boolField) boolField.setValue(fieldValue);
        }
      }
      
      return block;
    } catch (error) {
      console.error('Error creating value block:', error);
      return null;
    }
  };

  const connectBlocks = (connection1, connection2) => {
    return new Promise((resolve) => {
      try {
        if (connection1 && connection2 && 
            connection1.isConnected && connection2.isConnected &&
            !connection1.isConnected() && !connection2.isConnected()) {
          
          // Check if connection is valid
          if (connection1.checkType(connection2)) {
            connection1.connect(connection2);
            console.log('✅ Blocks connected successfully');
          } else {
            console.log('⚠️ Connection type mismatch');
          }
        }
        resolve();
      } catch (error) {
        console.error('Error connecting blocks:', error);
        resolve();
      }
    });
  };

  const exportBlocks = () => {
    if (workspace.current) {
      try {
        const xml = Blockly.Xml.workspaceToDom(workspace.current);
        const xmlText = Blockly.Xml.domToText(xml);
        
        const blob = new Blob([xmlText], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dart_blocks.xml';
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting blocks:', error);
      }
    }
  };

  const clearWorkspace = () => {
    if (workspace.current) {
      workspace.current.clear();
      lastProcessedCode.current = '';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">🧩 Visual Blocks Representation</h3>
        <div className="flex gap-2">
          <button
            onClick={clearWorkspace}
            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Clear Blocks
          </button>
          <button
            onClick={exportBlocks}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            Export Blocks
          </button>
        </div>
      </div>
      <div 
        ref={blocklyDiv} 
        style={{ height: '500px', width: '100%' }}
        className="border border-gray-300 rounded-lg"
      />
    </div>
  );
};

export default BlocklyWorkspace;