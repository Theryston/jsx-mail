import { FEATURES } from './content/features';
import { FadeIn } from './FadeIn';
import { FeaturesBento } from './FeaturesBento';

export function Features() {
  return (
    <FadeIn className="py-16 md:py-24 lg:py-32">
      <FeaturesBento
        header="Why JSX Mail?"
        body="JSX Mail simplifies the creation of email templates by automatically optimizing and hosting images, offering real-time preview, high compatibility with email clients, independence from React, ease of use and componentization."
        features={FEATURES}
      />
    </FadeIn>
  );
}
