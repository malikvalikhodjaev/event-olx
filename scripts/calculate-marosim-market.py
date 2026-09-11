"""Recalculate explicit research assumptions; no product or external state writes."""
from __future__ import annotations

import argparse
import json
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODEL = ROOT / "docs/research/marosim-market-model-v0.2.json"


def calculate(verify_snapshot: bool = False) -> dict:
    model = json.loads(MODEL.read_text(encoding="utf-8"))
    catalog = (ROOT / "lib/catalog-seed.ts").read_text(encoding="utf-8")
    definitions = (ROOT / "lib/demo-data.ts").read_text(encoding="utf-8")
    actual_ids = set(re.findall(r'\{ id: "(cat-[^"]+)"', definitions))
    modeled_ids = {row["id"] for row in model["categories"]}
    assert actual_ids == modeled_ids, (actual_ids - modeled_ids, modeled_ids - actual_ids)
    assert sum(row["sku"] for row in model["categories"]) == 100
    for row in model["categories"]:
        actual_count = len(re.findall(r'categoryId: "' + re.escape(row["id"]) + '"', catalog))
        assert row["sku"] == actual_count, (row["id"], row["sku"], actual_count)
        assert all(0 <= share <= 1 for share in row["share"])
        assert all(price >= 0 for price in row["price_mln"])

    weddings = []
    b2b = []
    wedding_rows = [row for row in model["categories"] if row["id"] != "cat-training"]
    training = next(row for row in model["categories"] if row["id"] == "cat-training")
    for i, name in enumerate(model["scenario_names"]):
        basket = sum(row["share"][i] * row["price_mln"][i] for row in wedding_rows)
        events = model["marriages_national"] * model["paid_event_factor"][i]
        national_banquet = model["national_guests"][i] * model["banquet_price_mln"][i]
        local_basket = model["national_guests"][i] * model["tashkent_banquet_price_mln"][i]
        local_basket += (basket - national_banquet) * model["tashkent_non_banquet_multiplier"][i]
        local_scope = model["marriages_tashkent"] * model["paid_event_factor"][i] * local_basket / 1000
        result = {
            "name": name,
            "basket_mln": basket,
            "events": events,
            "gmv_bn": events * basket / 1000,
            "tashkent_basket_mln": local_basket,
            "tashkent_scope_bn": local_scope,
            "sam_bn": local_scope * model["addressable_tashkent_share"][i],
        }
        for key, value in result.items():
            if verify_snapshot and key != "name":
                assert math.isclose(value, model["wedding"][i][key], rel_tol=1e-10), (key, value)
        weddings.append(result)
        buyers = model["company_count"] * training["share"][i]
        events_b2b = buyers * model["b2b_events_per_buyer"][i]
        b2b_result = {"name": name, "buyers": buyers, "events": events_b2b, "gmv_bn": events_b2b * training["price_mln"][i] / 1000}
        if verify_snapshot:
            assert math.isclose(b2b_result["gmv_bn"], model["b2b"][i]["gmv_bn"], rel_tol=1e-10)
        b2b.append(b2b_result)

    # The guest sensitivity changes each per-person category, keeping other assumptions fixed.
    variable_ids = {"cat-venue", "cat-gifts-print", "cat-cakes", "cat-tableware"}
    cost_per_guest_mln = sum(row["share"][1] * row["price_mln"][1] / model["national_guests"][1] for row in wedding_rows if row["id"] in variable_ids)
    sensitivity = {
        "20_guests_bn": weddings[1]["events"] * 20 * cost_per_guest_mln / 1000,
        "50000_banquet_unit_bn": weddings[1]["events"] * model["national_guests"][1] * 0.05 / 1000,
        "10pp_paid_events_bn": model["marriages_national"] * 0.1 * weddings[1]["basket_mln"] / 1000,
    }
    related_gmv = 100 * 12 * 0.15 * 1.3 * 4_000_000
    revenue = related_gmv * 0.05 * 0.7
    assert related_gmv == 936_000_000
    assert math.isclose(revenue, 32_760_000)
    assert 130 * 260_000 + 1_200_000 == 35_000_000
    return {"verified_categories": len(actual_ids), "verified_sku": 100, "wedding": weddings, "b2b": b2b, "sensitivity_bn": sensitivity, "illustrative_gmv_uzs": related_gmv, "illustrative_revenue_uzs": revenue}


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Also verify the published snapshot against recalculated values")
    arguments = parser.parse_args()
    print(json.dumps(calculate(verify_snapshot=arguments.check), ensure_ascii=False, indent=2))
