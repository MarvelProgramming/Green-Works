export default {
  get value() {
    return {
      id: -1,
      name: 'John Doe',
      tasks: [],
      settings: [
        {
          label: 'Disable notifications for 8 hours',
          status: false,
          toggle: false
        },
        {
          label: 'Disable all notifications',
          status: false,
          toggle: false
        }
      ],
      photo_thumb_small: '',
      is_admin: false
    };
  }
};
