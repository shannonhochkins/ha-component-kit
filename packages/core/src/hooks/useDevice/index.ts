import { useEffect, useState } from "react";
import { useHass, type EntityRegistryEntry, type EntityName } from "@core";

export interface ExtEntityRegistryEntry extends EntityRegistryEntry {
  capabilities: Record<string, unknown>;
  original_icon?: string;
  device_class?: string;
  original_device_class?: string;
  aliases: string[];
  options?: Record<string, unknown>;
  categories?: Record<string, unknown>;
}

export const useDevice = (entityId: EntityName) => {
  const [device, setDevice] = useState<ExtEntityRegistryEntry | null>(null);

  const { useStore } = useHass();
  const connection = useStore((state) => state.connection);

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
