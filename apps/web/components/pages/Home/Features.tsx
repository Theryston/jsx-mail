import { FEATURES } from './content/features';
import { FadeIn } from './FadeIn';
import { FeaturesBento } from './FeaturesBento';

export function Features() {
  return (
    <FadeIn className="py-10">
      <FeaturesBento
        header="Why JSX Mail?"
        body="JSX Mail simplifies the creation of email templates by automatically optimizing and hosting images, offering real-time preview, high compatibility with email clients, independence from React, ease of use and componentization."
        features={FEATURES}
      />
    </FadeIn>
  );
}
