import axios from 'axios';
import { translateError } from './index.js';

interface Data {
  name?: string;
  slug?: string;
  hostname?: string;
  dns?: string[];
  description?: string;
  long_description?: string;
  advanced?: boolean;
  stage?: string;
  repository?: string;
  version_latest?: string;
  protected?: boolean;
  rating?: number;
  boot?: string;
  options?: {
    html_file_path?: string;
    spa_mode?: boolean;
    custom_dashboard?: boolean;
  };
  schema?: Array<{
    name?: string;
    required?: boolean;
    type?: string;
  }>;
  arch?: string[];
  machine?: any[];
  homeassistant?: any;
  url?: string | null;
  detached?: boolean;
  available?: boolean;
  build?: boolean;
  network?: any;
  network_description?: any;
  host_network?: boolean;
  host_pid?: boolean;
  host_ipc?: boolean;
  host_uts?: boolean;
  host_dbus?: boolean;
  privileged?: any[];
  full_access?: boolean;
  apparmor?: string;
  icon?: boolean;
  logo?: boolean;
  changelog?: boolean;
  documentation?: boolean;
  stdin?: boolean;
  hassio_api?: boolean;
  hassio_role?: string;
  auth_api?: boolean;
  homeassistant_api?: boolean;
  gpio?: boolean;
  usb?: boolean;
  uart?: boolean;
  kernel_modules?: boolean;
  devicetree?: boolean;
  udev?: boolean;
  docker_api?: boolean;
  video?: boolean;
  audio?: boolean;
  startup?: string;
  services?: any[];
  discovery?: any[];
  translations?: Record<string, any>;
  ingress?: boolean;
  signed?: boolean;
  state?: string;
  webui?: any;
  ingress_entry?: string;
  ingress_url?: string;
  ingress_port?: number;
  ingress_panel?: boolean;
  audio_input?: any;
  audio_output?: any;
  auto_update?: boolean;
  ip_address?: string;
  version?: string;
  update_available?: boolean;
  watchdog?: boolean;
  devices?: any[];
}


export async function getAddonInfo() {
  // Function to get the ingress URL from Home Assistant API
  try {
    const response = await axios.get<{
      data: Data;
    }>('http://hassio/addons/self/info', {
      headers: {
        'Authorization': `Bearer ${process.env.SUPERVISOR_TOKEN}`
      }
    });
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching ingress URL:', translateError(error));
  }
  return null;
}