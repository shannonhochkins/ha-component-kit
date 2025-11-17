import { useEffect, useState } from "react";
import { useHass, type ExtEntityRegistryEntry, type EntityName } from "@core";

export const useDevice = (entityId: EntityName): ExtEntityRegistryEntry | null => {
  const [device, setDevice] = useState<ExtEntityRegistryEntry | null>(null);

  const connection = useHass((state) => state.connection);

  useEffect(() => {
    const getDevice = async () => {
      if (!connection) {
        return;
      }

      const response = await connection.sendMessagePromise<ExtEntityRegistryEntry>({
        type: "config/entity_registry/get",
        entity_id: entityId,
      });
      setDevice(response);
    };

    void getDevice();
  }, [connection, entityId]);

  return device;
};
