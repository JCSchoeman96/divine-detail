import type { LayoutServerLoad } from "./$types";
import { supabase } from "$lib/supabaseClient";

export const load: LayoutServerLoad = async () => {
  try {
    const { data, error } = await supabase
      .from("countries")
      .select("name")
      .limit(3);

    if (error) {
      return {
        supabaseFooterProbe: {
          ok: false,
          count: 0,
        },
      };
    }

    return {
      supabaseFooterProbe: {
        ok: true,
        count: data?.length ?? 0,
      },
    };
  } catch {
    return {
      supabaseFooterProbe: {
        ok: false,
        count: 0,
      },
    };
  }
};
