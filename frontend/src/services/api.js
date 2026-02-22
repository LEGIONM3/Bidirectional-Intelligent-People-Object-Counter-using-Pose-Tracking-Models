import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = {
    setLines: async (lines, videoWidth, videoHeight) => {
        return axios.post(`${API_URL}/set-lines`, { lines, video_width: videoWidth, video_height: videoHeight });
    },

    getStats: async () => {
        return axios.get(`${API_URL}/get-stats`);
    },

    resetCount: async () => {
        return axios.post(`${API_URL}/reset-count`);
    },

    uploadVideo: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axios.post(`${API_URL}/upload-video`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    startLiveCamera: async () => {
        return axios.post(`${API_URL}/start-live`);
    },

    getVideoFeedUrl: () => {
        return `${API_URL}/video-feed`;
    }
};
