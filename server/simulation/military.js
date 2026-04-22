export class MilitarySimulator {
  static simulate(countries) {
    for (const country of countries) {
      this.updateReadiness(country);
      this.trainTroops(country);
      this.upgradeEquipment(country);
      this.nuclearPosturing(country);
    }
  }

  static updateReadiness(country) {
    const mil = country.military;
    if (!mil) return;

    const budgetRatio = mil.budget / country.gdp;
    const targetReadiness = Math.min(95, budgetRatio * 100 + 30);

    mil.readiness += (targetReadiness - mil.readiness) * 0.1;
    mil.readiness = Math.round(mil.readiness * 10) / 10;
  }

  static trainTroops(country) {
    const mil = country.military;
    if (!mil || !mil.army) return;

    if (mil.budget > 30000000000) {
      mil.readiness = Math.min(95, mil.readiness + 0.5);
    }

    mil.army.effectiveness = (mil.army.divisions * 1000) * (mil.readiness / 100);
  }

  static upgradeEquipment(country) {
    const mil = country.military;
    if (!mil || !mil.army) return;

    const tech = country.technologies?.ai || 3;

    if (mil.army.tanks > 0) {
      mil.army.tank_quality = tech * 0.5 + 3;
    }
    if (mil.airforce?.fighters > 0) {
      mil.airforce.fighter_quality = tech * 0.6 + 4;
    }
  }

  static nuclearPosturing(country) {
    const mil = country.military;
    if (!mil || !mil.nuclear) return;

    if (mil.nuclear.warheads > 0) {
      country.softPower = (country.softPower || 0) + mil.nuclear.warheads * 0.1;
    }
  }

  static calculateStrength(country) {
    const mil = country.military;
    if (!mil) return 0;

    let strength = 0;
    strength += (mil.army?.divisions || 0) * 100;
    strength += (mil.airforce?.fighters || 0) * 50;
    strength += (mil.navy?.submarines || 0) * 80;
    strength += (mil.nuclear?.warheads || 0) * 200;
    strength *= (mil.readiness / 100);

    return Math.round(strength);
  }

  static canAttack(attacker, defender) {
    const attackPower = this.calculateStrength(attacker);
    const defensePower = this.calculateStrength(defender);

    return attackPower > defensePower * 1.5;
  }
}