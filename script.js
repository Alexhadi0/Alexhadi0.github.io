                        document.addEventListener('DOMContentLoaded', function() {
                            // Adding event listeners to various buttons and form submission
                            document.getElementById('addVlanBtn').addEventListener('click', addVlanField);
                            document.getElementById('removeVlanBtn').addEventListener('click', removeLastVlan);
                            document.getElementById('configForm').addEventListener('submit', generateConfig);
                            document.getElementById('exportBtn').addEventListener('click', exportConfig);
                            document.getElementById('addPortLabelBtn').addEventListener('click', addPortLabelField);
                            document.getElementById('removePortLabelBtn').addEventListener('click', removeLastPortLabel);
                            
                            // New event listeners for TFTP and Telnet VLAN functionalities
                            document.getElementById('disableTftp').addEventListener('change', handleTftpChange);
                            document.getElementById('specificTelnetVlan').addEventListener('change', handleTelnetVlanChange);
                            document.getElementById('telnetVlanNumber').addEventListener('input', updateTelnetVlanNumber);
                            
                            // New Event listeners for restrict AAA Access
                            document.getElementById('restrictAaaAccess').addEventListener('change', handleAaaAccessChange);

                            // New Event listeners for szActiveList Droplist
                            document.getElementById('szActiveList').addEventListener('change', function() {
                                switchConfig.szActiveList = this.value ? "sz active-list " + this.value : "";
                            });
                            
                            // New Event listeners for SNMP, Web management, Web management HP, Jumbo
                            document.getElementById('disableSnmpAccess').addEventListener('change', handleDisableSnmpAccessChange);
                            document.getElementById('disableWebManagement').addEventListener('change', handleDisableWebManagementChange);
                            document.getElementById('disableWebManagementByHp').addEventListener('change', handleDisableWebManagementByHpChange);
                            document.getElementById('jumbo').addEventListener('change', handleJumboChange);

                            // Event listener for the SSH Timeout checkbox
                            document.getElementById('enableSshTimeout').addEventListener('change', function() {
                                const sshTimeoutField = document.getElementById('sshTimeoutValue');
                                const sshTimeoutLabel = document.getElementById('sshTimeoutLabel');
                                if (this.checked) {
                                    sshTimeoutField.style.display = 'block'; // Show the field
                                    sshTimeoutLabel.style.display = 'block'; // Show the label
                                } else {
                                    sshTimeoutField.style.display = 'none'; // Hide the field
                                    sshTimeoutLabel.style.display = 'none'; // Hide the label
                                }
                            });
                        });


                        // New functions for handling TFTP and Telnet VLAN checkboxes
                        function handleTftpChange() {
                            if (this.checked) {
                                switchConfig.tftp = "tftp disable";
                            } else {
                                switchConfig.tftp = "no tftp disable";
                            }
                        }

                        function handleTelnetVlanChange() {
                            var vlanInputContainer = document.getElementById('vlanInputContainer');
                            if (this.checked) {
                                vlanInputContainer.style.display = 'block';
                                switchConfig.telnetVlan = "telnet server enable vlan " + document.getElementById('telnetVlanNumber').value;
                            } else {
                                vlanInputContainer.style.display = 'none';
                                switchConfig.telnetVlan = "no telnet server";
                            }
                        }

                        function updateTelnetVlanNumber() {
                            if (document.getElementById('specificTelnetVlan').checked) {
                                switchConfig.telnetVlan = "telnet server enable vlan " + this.value;
                            }
                        }

                        //New functions for handling AAA Access checkboxes
                        function handleAaaAccessChange() {
                            if (this.checked) {
                                switchConfig.restrictAaaAccess = "aaa authentication web-server default local\naaa authentication login default local";
                            } else {
                                switchConfig.restrictAaaAccess = "";
                            }
                        }

                        // New functions for SNMP, Web managment, Web management HP, Jumbo
                        function handleDisableSnmpAccessChange() {
                            if (this.checked) {
                                switchConfig.disableSnmp = "no snmp-server";
                            } else {
                                switchConfig.disableSnmp = "";
                            }
                        }

                        function handleDisableWebManagementChange() {
                            if (this.checked) {
                                switchConfig.disableWebManagement = "no web-management http";
                            } else {
                                switchConfig.disableWebManagement = "";
                            }
                        }

                        function handleDisableWebManagementByHpChange() {
                            if (this.checked) {
                                switchConfig.disableWebManagementByHp = "no web-management hp-top-tools";
                            } else {
                                switchConfig.disableWebManagementByHp = "";
                            }
                        }

                        function handleJumboChange() {
                            if (this.checked) {
                                switchConfig.jumbo = "jumbo";
                            } else {
                                switchConfig.jumbo = "no jumbo";
                            }
                        }


                        // configuration object
                        let switchConfig = {
                            tftp: "",
                            telnetVlan: "",
                            restrictAaaAccess: "",
                            szActiveList: "",
                            disableSnmp: "",
                            disableWebManagement: "",
                            disableWebManagementByHp: "",
                            jumbo: "",
                        };

                        // Function to add a new VLAN configuration field
                        function addVlanField() {
                            const vlanSection = document.getElementById('vlanSection');
                            const newVlanEntry = vlanSection.firstElementChild.cloneNode(true);
                            newVlanEntry.querySelectorAll('input').forEach(input => input.value = '');
                            vlanSection.appendChild(newVlanEntry);
                        }

                        // Function to remove the last VLAN configuration field
                        function removeLastVlan() {
                            const vlanSection = document.getElementById('vlanSection');
                            if (vlanSection.children.length > 1) {
                                vlanSection.removeChild(vlanSection.lastElementChild);
                            } else {
                                alert('At least one VLAN must remain.');
                            }
                        }

                        // Function to add a new port label field
                        function addPortLabelField() {
                            const portLabelSection = document.getElementById('portLabelSection');
                            if (portLabelSection) {
                                const newPortLabelEntry = portLabelSection.firstElementChild.cloneNode(true);
                                newPortLabelEntry.querySelectorAll('input').forEach(input => input.value = '');
                                portLabelSection.appendChild(newPortLabelEntry);
                            } else {
                                console.error('The portLabelSection element was not found in the DOM.');
                            }
                        }

                        // Function to remove the last port label field
                        function removeLastPortLabel() {
                            const portLabelSection = document.getElementById('portLabelSection');
                            if (portLabelSection.children.length > 1) {
                                portLabelSection.removeChild(portLabelSection.lastElementChild);
                            } else {
                                alert('At least one Port Label must remain.');
                            }
                        }

                        // Function to generate the switch configuration based on user inputs
                        function generateConfig(event) {
                            event.preventDefault(); // Prevents form submission from reloading the page
                            let config = 'hostname ' + document.getElementById('hostname').value + '\n';
                            config += 'ip address ' + document.getElementById('mgmtip').value;
                            config += ' ' + document.getElementById('mgmtsubnet').value + '\n';

                            // Include TFTP and Telnet VLAN settings in the configuration
                            if (switchConfig.tftp) {
                                config += switchConfig.tftp + '\n';
                            }
                            if (switchConfig.telnetVlan) {
                                config += switchConfig.telnetVlan + '\n';
                            }
                            if (switchConfig.restrictAaaAccess) {
                                config += switchConfig.restrictAaaAccess + '\n';
                            }
                            if (switchConfig.szActiveList) {
                                config += switchConfig.szActiveList + '\n';
                            }
                            
                                // Include Additional Options
                            if (switchConfig.disableSnmp) {
                                config += switchConfig.disableSnmp + '\n';
                            }
                            if (switchConfig.disableWebManagement) {
                                config += switchConfig.disableWebManagement + '\n';
                            }
                            if (switchConfig.disableWebManagementByHp) {
                                config += switchConfig.disableWebManagementByHp + '\n';
                            }
                            if (switchConfig.jumbo) {
                                config += 'device(config)# ' + switchConfig.jumbo + '\n';
                            }
                            // Handle SSH Timeout
                            const enableSshTimeout = document.getElementById('enableSshTimeout').checked;
                            let sshTimeoutValue = document.getElementById('sshTimeoutValue').value;

                            if (enableSshTimeout) {
                                if (!sshTimeoutValue || sshTimeoutValue < 1 || sshTimeoutValue > 120) {
                                    sshTimeoutValue = 120; // Default value if out of range or not provided
                                }
                                config += 'ip ssh timeout ' + sshTimeoutValue + '\n';
                            }

                                                    
                            // Process each VLAN entry and add to configuration
                            const vlanEntries = document.querySelectorAll('.vlan-entry');
                            vlanEntries.forEach(entry => {
                                const vlanIdElement = entry.querySelector('.vlanId');
                                if (vlanIdElement) {
                                    const id = vlanIdElement.value;
                                    const name = entry.querySelector('.vlanName').value;
                                    const taggedPorts = entry.querySelector('.taggedPorts').value;
                                    const untaggedPorts = entry.querySelector('.untaggedPorts').value;

                                    config += '\nvlan ' + id + ' name ' + name + '\n';
                                    if (taggedPorts) {
                                        config += 'tagged ethernet ' + taggedPorts + '\n';
                                    }
                                    if (untaggedPorts) {
                                        config += 'untagged ethernet ' + untaggedPorts + '\n';
                                    }
                                    config += 'Exit\n';
                                }
                            });

                         // Handle Port Labels
                            const portLabelEntries = document.querySelectorAll('#portLabelSection .vlan-entry');
                            portLabelEntries.forEach(entry => {
                            const portRange = entry.querySelector('[name="portRange"]').value;
                            const portName = entry.querySelector('[name="portName"]').value;
                            if (portRange && portName) {
                                config += '\nInterface ethernet ' + portRange + '\n';
                                config += 'Port-name ' + portName + '\n';
                                config += 'Exit\n';
                            }
                        });

                            document.getElementById('configOutput').textContent = config;
                        }


                        // Function to export the generated configuration as a text file
                        function exportConfig() {
                            const config = document.getElementById('configOutput').textContent;
                            if (!config) {
                                alert('No configuration to export. Please generate the configuration first.');
                                return;
                            }

                            const blob = new Blob([config], { type: 'text/plain' });
                            const fileUrl = URL.createObjectURL(blob);

                            const a = document.createElement('a');
                            a.href = fileUrl;
                            a.download = 'config.txt';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(fileUrl);
                        }
