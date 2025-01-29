
export const templateCodeToProcess = `
  {% if is_state(entity_id, "on") %}
    The entity is on!!
  {% else %}
    The entity is not on!!
  {% endif %}
`;