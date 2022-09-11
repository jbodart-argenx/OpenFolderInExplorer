import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as os from 'os';

let NEXT_TERM_ID = 1;

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('extension.openFolderInExplorer', (uri: vscode.Uri) => {
			const platform = os.platform();

			console.log('Platform: '+platform);

			const command = (platform === 'win32' && 'explorer')
				|| (platform === 'linux' && 'xdg-open')
				|| (platform === 'darwin' && 'open');

			if (!command) {
				vscode.window.showWarningMessage(`Your operating system (${platform}) isn't supported.`);
				return;
			}

			console.log('Command: '+command);
			console.log("Path: "+uri.fsPath);

			cp.execSync(`${command} "${uri.fsPath}"`);
		}),
		vscode.commands.registerCommand('extension.echoPath', (uri: vscode.Uri) => {
			console.log("Path: "+uri.fsPath);
			let command = "echo";
			cp.execSync(`${command} "${uri.fsPath}"`); // shows no output

			// This runs the command without showing it and captures outputs
			// const cp = require('child_process')
			cp.exec('echo "Hello VS Code!"', (err, stdout, stderr) => {
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
				if (err) {
					console.log('error: ' + err);
				}
			});
			let termname = "myTerminal";
			let term = vscode.window.createTerminal(termname);
			term.show(true);
			vscode.window.onDidCloseTerminal(event => {
				if (term && event.name === termname) {
					term.dispose();
				}
			});
			command = "echo "+uri.fsPath;
			term.sendText(command);
			vscode.window.showInformationMessage('Hello World 1!');
			
		}),
		vscode.commands.registerCommand('extension.createTermAndSend', (uri: vscode.Uri) => {
			// Create a terminal and run a command in it			
			console.log("createTermAndSend -- Terminals: " + (<any>vscode.window).terminals.length);
			let terminal = vscode.window.activeTerminal;
			if (terminal === undefined) {
				let terminalName = `Ext Terminal #${NEXT_TERM_ID++}`;
			    let terminal = vscode.window.createTerminal(terminalName);
				terminal.show(true);
				vscode.window.onDidCloseTerminal(event => {
					if (terminal && event.name === terminalName) {
						terminal.dispose();
					}
				});		
				terminal.sendText("echo \"Sent text immediately after creating\"");
				vscode.window.showInformationMessage('Hello World 2!');
				terminal.sendText("ls "+uri.fsPath);
				console.log("createTermAndSend -- Done.");		
			} else {
				terminal.show(true);
				terminal.sendText("echo \"Sent text immediately after creating\"");
				vscode.window.showInformationMessage('Hello World 2!');
				terminal.sendText("ls "+uri.fsPath);
				console.log("createTermAndSend -- Done.");
			}						
		}),
		vscode.commands.registerCommand('extension.openFolderInNewInstance', (uri: vscode.Uri) => {
			vscode.commands.executeCommand('vscode.openFolder', uri, true);
		})
	);
}

export function deactivate() { }