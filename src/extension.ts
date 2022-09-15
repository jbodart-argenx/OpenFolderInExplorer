'use strict';
import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as os from 'os';
//import * as escapeStringRegexp from 'escape-string-regexp';
//import escapeStringRegexp from 'escape-string-regexp';
//import { default as escapeStringRegexp } from 'escape-string-regexp';
import fs = require('fs');
import path = require('path');
//import escapeRegExp = require('escape-string-regexp');
//let escapeRegExp =require('escape-string-regexp');
//import escapeStringRegexp from 'escape-string-regexp';


			

let NEXT_TERM_ID = 1;
const platform = os.platform();
const userHomeDir = os.homedir();
const lsafJsonPath = os.homedir()+path.sep+".lsaf"+path.sep+"lsaf.json";

function LsafLocalRootFolder() {
	if (fs.existsSync(lsafJsonPath)) {
		//let rawData = fs.readFileSync(lsafJsonPath);
		//let lsaf_path = JSON.parse(rawData).localRootFolder;
		let lsaf_path = require(lsafJsonPath).localRootFolder;
		console.log('LSAF local Root Folder: '+lsaf_path);
		return lsaf_path;
	} else {
		return ".";
	}
}

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
			//function escapeRegExp(str: string) {
			//	return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
			//}
			function escapeRegExp(string: string){
				return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			  }
			//let RegexEscape = require("regex-escape");
			console.log("Path: "+uri.fsPath);
			let ux_path = uri.fsPath.replace(/\\/g, "/",);
			console.log("ux_path: "+ux_path);			
			let LsafLRF = LsafLocalRootFolder();
			console.log("LsafLRF = "+LsafLRF);
			//let escLsafLRF =  escapeRegExp(LsafLRF);
			//let escLsafLRF =  escapeStringRegexp(LsafLRF);
			//let escLsafLRF =  RegexEscape(LsafLRF);
			//console.log("escLsafLRF = "+escLsafLRF.valueOf);
			//let lsafLRF_pattern = new RegExp("^"+escLsafLRF, 'i');

			//let lsafLRF_pattern = new RegExp("^"+LsafLRF, 'i');
			//const escrx = escapeStringRegexp.default(LsafLRF);
			//const escrx = escapeRegExp(LsafLRF);
			//var escrx = LsafLRF.replace(new RegExp("[-[{}()*+?.,^$|#]", "g"), "\\$&");
			//var escrx = LsafLRF.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			var escrx = LsafLRF;
			console.log("escrx: "+escrx);
			let lsafLRF_pattern = new RegExp("^"+escrx, 'i');
			//let lsafLRF_pattern = new RegExp("^"+(LsafLRF), 'i');
			
			//let lsafLRF_pattern = new RegExp("^"+escapeRegExp(LsafLRF), 'i');
			//let lsafLRF_pattern = new RegExp("^c:/Users/jbodart/lsaf", 'i');
			var lsaf_path = ux_path;
			let is_matching = lsafLRF_pattern.test(ux_path);
			console.log('is_matching: '+is_matching);
			if (lsafLRF_pattern.test(ux_path)) {
				lsaf_path = ux_path.replace(lsafLRF_pattern, "");
				console.log("LSAF Path: "+ lsaf_path);			
			} else {
				console.error("Could not remove Lsaf Local Root Folder ("+LsafLRF+") from Unix Path: "+ux_path);
			}
			//lsaf_path = ux_path.replace(lsafLRF_pattern, "");
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
			command = "echo Upload "+uri.fsPath+" to LSAF path: "+lsaf_path;
			term.sendText(command);
			console.log(lsaf_path);
			vscode.window.showInformationMessage(lsaf_path);
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