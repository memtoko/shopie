module Shopie.Button.Spinner
  ( SpinnerQuery(..)
  , SpinnerS
  , SpinnerSlot(..)
  , mkSpinner
  , spinner
  ) where

import Prelude

import Halogen as H
import Halogen.HTML.Indexed as HH
import Halogen.HTML.Properties.Indexed as HP
import Halogen.HTML.Events.Indexed as HE


-- | The query algebra
data SpinnerQuery a
  = Submit a
  | UpdateText String a
  | IsSubmmitted (Boolean -> a)
  | ToggleSpinner Boolean a

-- | The state
type SpinnerS =
  { text :: String
  , submitted :: Boolean
  , class_ :: String
  }

-- | Slot for Spinner
newtype SpinnerSlot = SpinnerSlot String

derive instance eqSpinnerSlot :: Eq SpinnerSlot
derive instance ordSpinnerSlot :: Ord SpinnerSlot

-- | Create spinner State
mkSpinner :: String -> String -> SpinnerS
mkSpinner cls t = { text: t, class_: cls, submitted: false }

-- | The component
spinner :: forall g. H.Component SpinnerS SpinnerQuery g
spinner = H.component { render, eval }

render :: SpinnerS -> H.ComponentHTML SpinnerQuery
render st =
  HH.button
    [ HP.class_ $ HH.className st.class_
    , HE.onClick $ HE.input_ Submit
    ]
    [ if st.submitted then
        HH.span [ HP.class_ $ HH.className "spinner" ] []
      else
        HH.text st.text
    ]

eval :: forall g. SpinnerQuery ~> H.ComponentDSL SpinnerS SpinnerQuery g
eval (Submit next) = next <$ H.modify (_ { submitted = true } )
eval (IsSubmmitted cont) = cont <$> H.gets (_.submitted)
eval (ToggleSpinner b next) = next <$ H.modify (_ { submitted = b } )
eval (UpdateText t next) = next <$ H.modify (_ { text = t } )
